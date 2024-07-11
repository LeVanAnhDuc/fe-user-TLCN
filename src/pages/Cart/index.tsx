// libs
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
// types
import IProductCart from '@/types/productCart';
// components
import Button from '@/components/Button';
import AnimationScale from '@/components/AnimationScale';
import ProductsCart from './mains/ProductsCart';
import DeleteButton from './mains/DeleteButton';
import Error404 from '../Error404';
// apis
import { getSKU } from '@/apis/productApi';
// redux
import { selectProductsCart, selectToTalPriceCart, selectToTalProductCart, setProductsPurchase } from './cartSlice';
// others
import config from '@/config';
import { convertNumberToVND } from '@/utils/convertData';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const totalProduct = useSelector(selectToTalProductCart);
    const totalPrice = useSelector(selectToTalPriceCart);
    const products = useSelector(selectProductsCart);
    const { t } = useTranslation('cart');

    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [productsSelect, setProductsSelect] = useState<IProductCart[]>([]);
    const [productsQuantityFull, setProductsQuantityFull] = useState<
        {
            id: number;
            quantityAvailable: number;
        }[]
    >([]);

    const handleAddAllProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.checked ? setProductsSelect(products) : setProductsSelect([]);
    };

    const handleNavigateCheckout = async () => {
        if (productsSelect.length <= 0) {
            toast.error('Vui lòng chọn sản phẩm');
            return;
        }

        let isError = false;

        productsSelect.map((item) => {
            productsQuantityFull.map((product) => {
                if (isError) return;
                if (product.id === item.id && product.quantityAvailable < item.quantity) {
                    isError = true;
                    toast.error('Số lượng hiện đang không đủ');
                    return;
                }
            });
            if (isError) return;
        });

        if (isError) return;

        navigate(config.Routes.checkOut);
        dispatch(setProductsPurchase(productsSelect));
    };

    console.log(productsSelect);

    useEffect(() => {
        try {
            const fetchProductQuantities = async () => {
                const promises = products.map(async (item) => {
                    const response = await getSKU(
                        item.product.id,
                        item.sku.optionValues[0].valueName,
                        item.sku.optionValues[1].valueName,
                    );

                    setProductsQuantityFull((prev) => [
                        ...prev,
                        { id: item.id, quantityAvailable: response.data.quantityAvailable },
                    ]);
                });

                await Promise.all(promises);
            };

            fetchProductQuantities();
        } catch (error) {
            setErrorAPI(true);
        }
    }, []);

    if (errorAPI) {
        <Error404 />;
    }

    return (
        <>
            <div className="bg-gray-100 py-16 dark:bg-dark-400">
                <DeleteButton productsSelect={productsSelect} />
                <div className="grid lg:grid-cols-11 xl:grid-cols-12 gap-5 w-11/12 sm:w-10/12 m-auto">
                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="space-y-4">
                            <div className="w-full h-14 flex gap-1 bg-white rounded-lg dark:bg-dark-600 items-center text-sm px-4 font-semibold">
                                <div className="flex items-center gap-3 whitespace-nowrap">
                                    <Checkbox onChange={handleAddAllProduct} />
                                    {t('product')}
                                </div>
                                <div className="text-center w-full">{t('productInformation')}</div>
                            </div>

                            <ProductsCart
                                {...{
                                    productsSelect,
                                    setProductsSelect,
                                    productsQuantityFull,
                                }}
                            />
                        </div>
                        {products.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center gap-5">
                                <ContentPasteSearch sx={{ fontSize: '100px' }} className="text-gray-400" />
                                <span className="text-xl text-gray-400">{t('noProductInCart')}</span>
                                <Link to={config.Routes.shop}>
                                    <Button variant="fill">{t('shop')}</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-3 sticky top-20 bg-white h-fit w-full p-5 rounded-lg space-y-5 dark:bg-dark-600">
                        <h1 className="text-2xl font-bold text-center">{t('totalCost')}</h1>
                        <div className="flex flex-wrap justify-between gap-1">
                            <span className="font-semibold">{t('totalAmount')}</span>
                            <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                                <>
                                    {convertNumberToVND(totalPrice)}
                                    <span className="text-sm">đ</span>
                                </>
                            </AnimationScale>
                        </div>
                        <Button variant="fill" fullWidth disabled={totalProduct === 0} onClick={handleNavigateCheckout}>
                            {t('checkOut')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
