// libs
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, Controller, UseFormHandleSubmit, Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
// types
import { IOrderCheckOut } from '@/types/order';
import IAddress from '@/types/address';
import IProductCart from '@/types/productCart';
import { IProductCheckout } from '@/types/product';
// components
import Button from '@/components/Button';
import AnimationScale from '@/components/AnimationScale';
import AnimationTran from '@/components/AnimationTran';
// apis
import { addOrderByToken, makePaymentAgainByToken } from '@/apis/orderApi';
import { checkOutVNPay, makePaymentVNPay } from '@/apis/vnpayApi';
// redux
import { setItemsOfCart, setProductsPurchase, setToTalPriceCart, setToTalProductCart } from '@/pages/Cart/cartSlice';

// others
import config from '@/config';

const ToggleButton = styled(MuiToggleButton)({
    '&.Mui-selected': {
        backgroundColor: '#b2ebf2',
        color: 'black',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid #0097a7',
    },
    ' &.Mui-selected:hover': {
        backgroundColor: '#80deea',
    },
});

const CheckoutForm = ({
    productsPurchase,
    productsCart,
    setLoadingAPIs,
    idOrder,
    feePrice,
    totalPrice,
    handleSubmit,
    control,
    errors,
    addresses,
}: {
    productsPurchase: IProductCart[];
    productsCart: IProductCart[];
    setLoadingAPIs: React.Dispatch<React.SetStateAction<boolean>>;
    idOrder: number;
    feePrice: number;
    totalPrice: number;
    handleSubmit: UseFormHandleSubmit<IOrderCheckOut, IOrderCheckOut>;
    control: Control<IOrderCheckOut, unknown, IOrderCheckOut>;
    errors: FieldErrors<IOrderCheckOut>;
    addresses: IAddress[];
}) => {
    const { t } = useTranslation('checkOut');
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                toast.success(t('orderIsSuccess'));
                dispatch(setToTalProductCart(productsInCart.length));
                dispatch(setItemsOfCart(productsInCart));
                dispatch(setToTalPriceCart(priceCart));
                dispatch(setProductsPurchase([]));
                navigate(`${config.Routes.detailOrder}/${response.data.id}`);
            } else {
                toast.error(response?.data.message || response?.data);
            }

            return response.data;
        } catch (error) {
            console.log(`${error}`);
        }
    };

    const onSubmit: SubmitHandler<IOrderCheckOut> = async (data) => {
        let PAYMENT_TYPE: string = '';

        if (data.paymentType === config.PaymentType.CashOnDelivery) {
            PAYMENT_TYPE = 'COD';
            try {
                setLoadingAPIs(true);
                if (idOrder) {
                    const response = await makePaymentAgainByToken(+idOrder, {
                        total: totalPrice,
                        paymentType: PAYMENT_TYPE,
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
                    await handleCreateOrder(
                        totalPrice,
                        PAYMENT_TYPE,
                        data.note,
                        data.addressId,
                        feePrice,
                        feePrice + totalPrice,
                    );
                }
            } catch (error) {
                toast.error(`${error}`);
            } finally {
                setLoadingAPIs(false);
            }
        } else {
            PAYMENT_TYPE = 'VN_PAY';
            try {
                setLoadingAPIs(true);
                if (idOrder) {
                    const redirectURL = makePaymentVNPay(totalPrice, +idOrder, data.addressId, data.note);
                    window.location.href = redirectURL;
                } else {
                    const response = await handleCreateOrder(
                        totalPrice,
                        PAYMENT_TYPE,
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
            } finally {
                setLoadingAPIs(false);
            }
        }
    };

    return (
        <div className="space-y-3 bg-white p-5 sm:p-10 rounded-lg dark:bg-dark-600">
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
                                } !bg-white dark:!bg-dark-600 min-h-12 space-x-3`}
                            >
                                <ToggleButton
                                    className="!normal-case !text-sm h-14 !rounded-md !border-2 !border-gray-300 dark:!border-gray-600"
                                    value={config.PaymentType.VNPay}
                                >
                                    {t('vnPay')}
                                </ToggleButton>
                                <ToggleButton
                                    className="!normal-case !text-sm h-14 !rounded-md !border-2 !border-gray-300 dark:!border-gray-600"
                                    value={config.PaymentType.CashOnDelivery}
                                >
                                    {t('cashOnDelivery')}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        )}
                    />
                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.paymentType?.message}</p>
                </AnimationTran>

                {addresses.length > 0 ? (
                    <AnimationTran tranY={100} delay={0.05}>
                        <Controller
                            name="addressId"
                            control={control}
                            defaultValue={0}
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
                                                <div className="size-full flex items-center justify-between gap-2 overflow-hidden">
                                                    <div className="text-sm">
                                                        <div className="font-bold">
                                                            {item.fullName} {item.phoneNumber}{' '}
                                                            {item.isDefault && (
                                                                <span className="size-fit text-end text-sm font-normal text-primary-500 border-primary-500 border-2 px-2 ml-2 rounded-md">
                                                                    {t('default')}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap">
                                                            {item.orderDetails}, {item.ward}, {item.district},{' '}
                                                            {item.province}
                                                        </div>
                                                    </div>
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.addressId?.message}</p>
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
                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.note?.message}</p>
                </AnimationTran>

                <AnimationScale scale={0.4}>
                    <Button type="submit" variant="fill" fullWidth>
                        {t('placeAnOrder')}
                    </Button>
                </AnimationScale>
            </form>
        </div>
    );
};

export default CheckoutForm;
