import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import {
    selectProductsCart,
    selectProductsPurchaseCart,
    setItemsOfCart,
    setProductsPurchase,
    setToTalPriceCart,
    setToTalProductCart,
} from '../Cart/cartSlice';
import config from '../../config';
import { IOrderCheckOut } from '../../interface/order';
import IAddress from '../../interface/address';
import { getListAddressOffCurrentUser } from '../../apis/addressApi';
import { addOrderByToken, getOrderByID, makePaymentAgainByToken } from '../../apis/orderApi';
import { checkOutVNPay, makePaymentVNPay } from '../../apis/vnpayApi';
import Button from '../../components/Button';
import { convertNumberToVND } from '../../utils/convertData';
import AnimationScale from '../../components/AnimationScale';
import AnimationTran from '../../components/AnimationTran';
import { getFeeShipping } from '../../apis/GHN/FeeShip';
import IProductCart from '../../interface/productCart';
import Image from '../../components/Image';
import { IProductCheckout } from '../../interface/product';

const Pay = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productsPurchase = useSelector(selectProductsPurchaseCart);
    const productsCart = useSelector(selectProductsCart);
    const { t } = useTranslation('checkOut');

    let idOrder: number = 0;
    if (location.state) {
        idOrder = location.state.idOder;
        dispatch(setProductsPurchase(location.state.orderItems));
    }

    const [isChecked, setIsChecked] = useState(false);
    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [feePrice, setFeePrice] = useState<number>(0);

    const schema = yup.object().shape({
        paymentType: yup.string().required(t('paymentsIsRequired')),
        addressId: yup.number().required(t('addressHomeIsRequired')),
        note: yup.string(),
    });

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IOrderCheckOut>({
        resolver: yupResolver(schema),
    });

    const watchedAddressId = watch('addressId');

    const handleCheckboxChange = useCallback(
        (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
            setIsChecked(event.target.checked);
        },
        [],
    );

    const handleGetFeeShipping = async (to_district_id: number, to_ward_code: string) => {
        try {
            const response = await getFeeShipping(to_district_id, to_ward_code);
            if (response.status === 200) {
                setFeePrice(response.data.data.total);
            }
        } catch (error) {
            console.log(`${error}`);
        }
    };

    const getAddresses = async () => {
        try {
            const [addressesAPI] = await Promise.all([getListAddressOffCurrentUser()]);

            if (addressesAPI.status === 200 && addressesAPI?.data) {
                setAddresses(addressesAPI.data);
                const address = addressesAPI.data.filter((item: IAddress) => item.id === watchedAddressId)[0];

                handleGetFeeShipping(address.districtId, address.wardCode);
            }
        } catch (error) {
            console.log(`${error}`);
        }
    };

    const getAddressesAndOrderForWaiting = async () => {
        try {
            const [addressesAPI, OrderByIDAPI] = await Promise.all([
                getListAddressOffCurrentUser(),
                getOrderByID(+idOrder),
            ]);

            if (addressesAPI.status === 200 && addressesAPI?.data) {
                setAddresses(addressesAPI.data);
            }
            if (OrderByIDAPI.status === 200) {
                setTotalPrice(OrderByIDAPI.data.total);
                setValue('addressId', OrderByIDAPI.data.address.id);
                setValue('note', OrderByIDAPI.data.note);
                setValue('paymentType', OrderByIDAPI.data.paymentType);

                handleGetFeeShipping(OrderByIDAPI.data.address.districtId, OrderByIDAPI.data.address.wardCode);
            }
        } catch (error) {
            console.log(`${error}`);
        }
    };

    const handleRedirectDetailItem = (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
        }
    };

    const handleCreateOrder = async (
        subTotal: number = 0,
        paymentType: string = '',
        note: string = '',
        addressId: number = 0,
        shippingFee: number = 0,
        total: number = 0,
    ) => {
        try {
            const orderItems: IProductCheckout[] = productsPurchase.map((item) => ({
                price: item.price,
                quantity: item.quantity,
                subTotal: item.subTotal,
                productId: item.product.id,
                skuId: item.sku.skuId,
                imageUrl: item.imageUrl,
            }));

            const productsInCart: IProductCart[] = productsCart.filter(
                (item1) => !productsPurchase.some((item2) => item1.id === item2.id),
            );
            const priceCart = productsInCart.reduce((sum, value) => sum + value.subTotal, 0);

            const response = await addOrderByToken({
                subTotal,
                paymentType,
                note,
                addressId,
                shippingFee,
                total,
                orderItems,
            });

            if (response?.status === 201) {
                dispatch(setToTalProductCart(productsInCart.length));
                dispatch(setItemsOfCart(productsInCart));
                dispatch(setToTalPriceCart(priceCart));
                dispatch(setProductsPurchase([]));
            } else {
                toast.error(response?.data.message || response?.data);
            }

            return response.data;
        } catch (error) {
            console.log(`${error}`);
        }
    };

    const onSubmit: SubmitHandler<IOrderCheckOut> = async (data) => {
        let PaymentType: string = '';

        if (data.paymentType === config.PaymentType.CashOnDelivery) {
            PaymentType = 'COD';
            try {
                if (idOrder) {
                    const response = await makePaymentAgainByToken(+idOrder, {
                        total: totalPrice,
                        paymentType: PaymentType,
                        note: data.note,
                        addressId: data.addressId,
                    });

                    if (response?.status === 200) {
                        toast.success(t('orderIsSuccess'));
                        navigate(`${config.Routes.detailOrder}/${response.data.id}`);
                    } else {
                        toast.error(response?.data.message || response?.data);
                    }
                } else {
                    const response = await handleCreateOrder(
                        totalPrice,
                        PaymentType,
                        data.note,
                        data.addressId,
                        feePrice,
                        feePrice + totalPrice,
                    );
                    toast.success(t('orderIsSuccess'));
                    navigate(`${config.Routes.detailOrder}/${response.id}`);
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            PaymentType = 'VN_PAY';
            try {
                if (idOrder) {
                    const redirectURL = makePaymentVNPay(totalPrice, +idOrder, data.addressId, data.note);
                    window.location.href = redirectURL;
                } else {
                    const response = await handleCreateOrder(
                        totalPrice,
                        PaymentType,
                        data.note,
                        data.addressId,
                        feePrice,
                        feePrice + totalPrice,
                    );

                    const redirectURL = await checkOutVNPay(response.id);
                    window.location.href = redirectURL;
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        }
    };

    useEffect(() => {
        if (idOrder) {
            getAddressesAndOrderForWaiting();
        } else {
            getAddresses();
        }
    }, []);

    useEffect(() => {
        setTotalPrice(productsPurchase.reduce((sum, value) => sum + value.subTotal, 0));
    }, [productsPurchase]);

    useEffect(() => {
        const address = addresses.filter((item: IAddress) => item.id === watchedAddressId)[0];

        handleGetFeeShipping(address?.districtId ?? 0, address?.wardCode ?? '');
    }, [watchedAddressId]);

    return (
        <section className="bg-gray-100 py-5 sm:py-10 dark:bg-dark-400">
            <div className="sm:w-10/12 w-11/12 m-auto flex justify-center">
                <div className="grid lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-3 space-y-4">
                        {productsPurchase.map((item: IProductCart, index) => (
                            <div className="flex items-center" key={item.id}>
                                <AnimationTran
                                    tranY={100}
                                    key={index}
                                    className="size-full grid grid-cols-12 gap-2 bg-white rounded-lg overflow-hidden shadow p-2 dark:bg-dark-600"
                                    delay={(index % 4) / 20}
                                >
                                    <>
                                        <Image
                                            src={item.imageUrl}
                                            alt={'image' + item.product.name}
                                            className="col-span-3 md:col-span-2 object-cover object-center size-fit m-auto cursor-pointer"
                                            onClick={() => {
                                                handleRedirectDetailItem(item.product.id);
                                            }}
                                        />
                                        <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between ">
                                            <div className="line-clamp-2 font-semibold mb-3">{item.product.name}</div>
                                            <div className="flex justify-between items-center flex-wrap gap-1">
                                                <aside>
                                                    <div className="flex gap-1">
                                                        <span className="font-bold w-18">{t('classification')}:</span>
                                                        <span className="font-medium">
                                                            {item.sku?.optionValues?.map((option, index) => (
                                                                <React.Fragment key={index}>
                                                                    {option.valueName}
                                                                    {index < item.sku.optionValues.length - 1
                                                                        ? ' - '
                                                                        : ''}
                                                                </React.Fragment>
                                                            ))}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <span className="font-bold w-18">{t('unitPrice')}: </span>
                                                        <span className="not-italic font-medium text-red-500 flex gap-1">
                                                            {convertNumberToVND(item.price)}
                                                            <span className="text-xs"> đ</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <span className="font-bold w-18">{t('totalPrice')}:</span>
                                                        <div className="not-italic font-medium text-red-500 flex gap-1">
                                                            {convertNumberToVND(item.subTotal)}
                                                            <span className="text-xs">đ</span>
                                                        </div>
                                                    </div>
                                                </aside>
                                            </div>
                                        </div>
                                    </>
                                </AnimationTran>
                            </div>
                        ))}
                        <div className="space-y-3  bg-white p-5 sm:p-10 rounded-lg dark:bg-dark-600">
                            <div className="font-semibold text-xl">{t('yourContact')} ?</div>
                            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                                <AnimationTran tranY={100} className="space-y-2 font-bold">
                                    <div>{t('payments')}</div>
                                    <Controller
                                        name="paymentType"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <ToggleButtonGroup
                                                {...field}
                                                exclusive
                                                fullWidth
                                                className={`${
                                                    errors.paymentType ? 'border-2 border-red-400' : ''
                                                } !bg-white dark:!bg-dark-600 min-h-12`}
                                                color="info"
                                            >
                                                <ToggleButton
                                                    className="!normal-case !text-sm"
                                                    value={config.PaymentType.VNPay}
                                                >
                                                    {t('vnPay')}
                                                </ToggleButton>
                                                <ToggleButton
                                                    className="!normal-case !text-sm"
                                                    value={config.PaymentType.CashOnDelivery}
                                                >
                                                    {t('cashOnDelivery')}
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.paymentType?.message}
                                    </p>
                                </AnimationTran>

                                {addresses.length > 0 ? (
                                    <AnimationTran tranY={100} delay={0.05}>
                                        <Controller
                                            name="addressId"
                                            control={control}
                                            defaultValue={addresses.filter((item) => item.isDefault)[0].id}
                                            render={({ field }) => (
                                                <FormControl fullWidth>
                                                    <InputLabel>{t('addressHome')}</InputLabel>
                                                    <Select
                                                        {...field}
                                                        input={<OutlinedInput label={t('addressHome')} />}
                                                        fullWidth
                                                        error={errors.addressId ? true : false}
                                                    >
                                                        {addresses.map((item, index) => (
                                                            <MenuItem value={item.id} key={index}>
                                                                <div className="size-full">
                                                                    <div className="text-sm">
                                                                        <div className="flex gap-3 items-center font-bold">
                                                                            {item.fullName} {item.phoneNumber}
                                                                            {item.isDefault && (
                                                                                <div className="size-fit text-end text-sm text-primary-500 border-primary-500 border-2 px-1 py-0.5 rounded-lg">
                                                                                    Mặc định
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-wrap">
                                                                            {item.orderDetails}, {item.ward},{' '}
                                                                            {item.district}, {item.province}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                            {errors.addressId?.message}
                                        </p>
                                    </AnimationTran>
                                ) : (
                                    <Link to={config.Routes.profileAddressProfile}>
                                        <Button fullWidth variant="outline">
                                            {t('noAddressHome')}
                                        </Button>
                                    </Link>
                                )}

                                <AnimationTran tranY={100} delay={0.1}>
                                    <Controller
                                        name="note"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.note ? true : false}
                                                fullWidth
                                                multiline
                                                rows={9}
                                                label={t('enterNote')}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.note?.message}
                                    </p>
                                </AnimationTran>

                                <div className="grid grid-cols-10 pb-5">
                                    <span>
                                        <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
                                    </span>
                                    <span className="col-span-9 text-gray-400 dark:text-gray-300">
                                        {t('iHaveRead')}
                                        <span className="underline ml-0.5">{t('privacyPolicy')}</span> {t('and')}
                                        <span className="underline ml-0.5">{t('cookiePolicy')}</span>.
                                    </span>
                                </div>
                                <AnimationScale scale={0.4}>
                                    <Button type="submit" variant="fill" fullWidth disabled={!isChecked}>
                                        {t('placeAnOrder')}
                                    </Button>
                                </AnimationScale>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-5 lg:col-span-2 bg-white h-fit p-5 sm:p-10 rounded-lg sticky top-20 dark:bg-dark-600">
                        <h1 className="text-xl font-bold text-center">{t('totalCost')}</h1>
                        <div className="flex justify-between">
                            <span className="font-medium">{t('totalAmount')}</span>
                            <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                                {convertNumberToVND(totalPrice)}
                                <span className="text-sm">đ</span>
                            </AnimationScale>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">{t('totalDelivery')}</span>
                            <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                                {convertNumberToVND(feePrice)}
                                <span className="text-sm">đ</span>
                            </AnimationScale>
                        </div>
                        <div className="h-0.5 bg-gray-200 w-full"></div>

                        <div className="flex justify-between relative">
                            <span className="font-medium">{t('subtotal')}</span>
                            <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                                {convertNumberToVND(totalPrice + feePrice)}
                                <span className="text-sm">đ</span>
                            </AnimationScale>
                        </div>

                        <div className="h-0.5 bg-gray-200 w-full"></div>

                        <div className="text-center text-gray-600 dark:text-gray-300">
                            ({t('TotalPriceOfYourOrder')})
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pay;
