import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { setItemsOfCart, setToTalProductCart } from '../Cart/cartSlice';
import config from '../../config';
import { IOrderCheckOut } from '../../interface/order';
import IAddress from '../../interface/address';
import { getListAddressOffCurrentUser } from '../../apis/addressApi';
import { getTotalPriceForYourCart } from '../../apis/cartApi';
import { addOrderByToken, getOrderByID, makePaymentAgainByToken } from '../../apis/orderApi';
import { checkOutVNPay, makePaymentVNPay } from '../../apis/vnpayApi';
import Button from '../../components/Button';
import { convertNumberToVND } from '../../utils/convertData';
import AnimationScale from '../../components/AnimationScale';
import AnimationTran from '../../components/AnimationTran';

const Pay = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation('checkOut');

    let idOrder: number = 0;
    if (location.state) {
        idOrder = location.state.idOder;
    }

    const [isChecked, setIsChecked] = useState(false);
    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const schema = yup.object().shape({
        paymentType: yup.string().required(t('paymentsIsRequired')),
        addressId: yup.number().required(t('addressHomeIsRequired')),
        note: yup.string(),
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IOrderCheckOut>({
        resolver: yupResolver(schema),
    });

    const handleCheckboxChange = useCallback(
        (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
            setIsChecked(event.target.checked);
        },
        [],
    );

    const getAddressesAndTotalPrice = async () => {
        try {
            const [addressesAPI, totalPriceAPI] = await Promise.all([
                getListAddressOffCurrentUser(),
                getTotalPriceForYourCart(),
            ]);

            if (addressesAPI.status === 200 && addressesAPI?.data) {
                setAddresses(addressesAPI.data);
            }
            if (totalPriceAPI.status === 200) {
                setTotalPrice(totalPriceAPI?.data);
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
            }
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
                    const response = await addOrderByToken({
                        total: totalPrice,
                        paymentType: PaymentType,
                        note: data.note,
                        addressId: data.addressId,
                    });

                    if (response?.status === 201) {
                        dispatch(setToTalProductCart(0));
                        dispatch(setItemsOfCart([]));
                        toast.success(t('orderIsSuccess'));
                        navigate(`${config.Routes.detailOrder}/${response.data.id}`);
                    } else {
                        toast.error(response?.data.message || response?.data);
                    }
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            PaymentType = 'VN_PAY';
            const savedInfoUser = localStorage.getItem('infoUser');
            let userName: string = '';
            if (savedInfoUser) {
                const dataInfo: { userNameUser: string } = JSON.parse(savedInfoUser);
                userName = dataInfo.userNameUser;
            }
            try {
                if (idOrder) {
                    const redirectURL = makePaymentVNPay(totalPrice, +idOrder, data.addressId, data.note);
                    window.location.href = redirectURL;
                } else {
                    dispatch(setToTalProductCart(0));
                    dispatch(setItemsOfCart([]));
                    const redirectURL = checkOutVNPay(
                        {
                            total: totalPrice,
                            paymentType: PaymentType,
                            note: data.note,
                            addressId: data.addressId,
                        },
                        userName,
                    );
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
            getAddressesAndTotalPrice();
        }
    }, []);

    return (
        <section className="bg-gray-100 py-5 sm:py-10 dark:bg-dark-400">
            <div className="sm:w-10/12 w-11/12 m-auto flex justify-center">
                <div className="grid lg:grid-cols-5 gap-10">
                    <div className="space-y-3 lg:col-span-3 bg-white p-5 sm:p-10 rounded-lg dark:bg-dark-600">
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
                                                                        {item.district}, {item.city}
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
                                {convertNumberToVND(0)}
                                <span className="text-sm">đ</span>
                            </AnimationScale>
                        </div>
                        <div className="h-0.5 bg-gray-200 w-full"></div>

                        <div className="flex justify-between relative">
                            <span className="font-medium">{t('subtotal')}</span>
                            <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                                {convertNumberToVND(totalPrice)}
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
