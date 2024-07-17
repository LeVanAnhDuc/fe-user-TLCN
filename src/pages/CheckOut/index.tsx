// libs
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
// types
import { IOrderCheckOut } from '@/types/order';
import IAddress from '@/types/address';
// components
import PageLoading from '@/components/PageLoading';
import ProductsPurchase from './mains/ProductsPurchase';
import PriceTotal from './mains/PriceTotal';


import VnpayIcon from '@/components/icons/VnpayIcon';
import CodIcon from '@/components/icons/CodIcon';

// apis
import { addOrderByToken, makePaymentAgainByToken } from '@/apis/orderApi';
import { checkOutVNPay, makePaymentVNPay } from '@/apis/vnpayApi';

// redux
import { selectProductsCart, selectProductsPurchaseCart, setProductsPurchase } from '../Cart/cartSlice';
// ghosts
import GetAddressOrInfoOderWaiting from './ghosts/GetAddressOrInfoOderWaiting';
import GetPriceProduct from './ghosts/GetPriceProduct';
import GetFeeShipping from './ghosts/GetFeeShipping';
// others
import CheckoutForm from './mains/CheckoutForm';

const Pay = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const productsPurchase = useSelector(selectProductsPurchaseCart);
    const productsCart = useSelector(selectProductsCart);
    const { t } = useTranslation('checkOut');

    let idOrder: number = 0;
    if (location.state) {
        idOrder = location.state.idOder;
        dispatch(setProductsPurchase(location.state.orderItems));
    }

    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [feePrice, setFeePrice] = useState<number>(0);
    const [loadingAPIs, setLoadingAPIs] = useState<boolean>(false);

    const schema = yup.object().shape({
        paymentType: yup.string().required(t('paymentsIsRequired')),
        addressId: yup.number().required(t('addressHomeIsRequired')),
        note: yup.string(),
    });

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm<IOrderCheckOut>({
        resolver: yupResolver(schema),
    });

    const watchedAddressId = watch('addressId');

    return (
        <>
            <GetAddressOrInfoOderWaiting
                {...{
                    setAddresses,
                    idOrder,
                    setTotalPrice,
                    setValue,
                }}
            />
            <GetPriceProduct {...{ setTotalPrice, productsPurchase }} />

            <GetFeeShipping
                {...{
                    addresses,
                    watchedAddressId,
                    productsPurchase,
                    setFeePrice,
                }}
            />

            <section className="bg-gray-100 dark:bg-dark-400">
                {loadingAPIs && <PageLoading />}

                <div className="sm:w-10/12 w-11/12 m-auto flex justify-center py-5 sm:py-10">
                    <div className="grid lg:grid-cols-5 gap-10">
                        <div className="lg:col-span-3 space-y-4">
                            <ProductsPurchase />


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
                                                    } !bg-white dark:!bg-dark-600 max-h-10 min-h-10 space-x-6`}
                                                >
                                                    <ToggleButton
                                                        className="!normal-case !text-sm h-14 !rounded-md !border-2 !border-gray-300 dark:!border-gray-600"
                                                        value={config.PaymentType.VNPay}
                                                    >
                                                        <span className='font-md text-black'>{t('vnPay')}</span> 
                                                        <VnpayIcon/>
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        className="!normal-case !text-sm h-14 !rounded-md !border-2 !border-gray-300 dark:!border-gray-600"
                                                        value={config.PaymentType.CashOnDelivery}
                                                    >
                                                        <span className='font-md text-black'>{t('cashOnDelivery')}</span> 
                                                        <CodIcon/>
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            )}
                                        />
                                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                            {errors.paymentType?.message}
                                        </p>
                                    </AnimationTran>

                                    <div className="space-y-2 my-5 font-bold">{t('deliveryAddress')}</div>
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
                                                    rows={4}
                                                    label={t('enterNote')}
                                                />
                                            )}
                                        />
                                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                            {errors.note?.message}
                                        </p>
                                    </AnimationTran>

                                    <AnimationScale scale={0.4}>
                                        <Button type="submit" variant="fill" fullWidth>
                                            {t('placeAnOrder')}
                                        </Button>
                                    </AnimationScale>
                                </form>
                            </div>

                            <CheckoutForm
                                {...{
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
                                }}
                            />

                        </div>

                        <div className="space-y-5 lg:col-span-2 bg-white h-fit p-5 sm:p-10 rounded-lg sticky top-20 dark:bg-dark-600">
                            <PriceTotal {...{ totalPrice, feePrice }} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Pay;
