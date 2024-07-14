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
