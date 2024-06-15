// libs
import IconButton from '@mui/material/IconButton';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// types
import IProductCart from '../../interface/productCart';
import { actionProduct } from '../../interface/product';
// components
import Image from '../../components/Image';
import MouseOverPopover from '../../components/MouseOverPopover';
import Button from '../../components/Button';
import AnimationTran from '../../components/AnimationTran';
import AnimationScale from '../../components/AnimationScale';
import ChangeQuantityProduct from './ChangeQuantityProduct';
// apis
import { updateProductAnalysis } from '../../apis/productApi';
import { getCartByToken } from '../../apis/cartApi';
import { changeItemQuantity, deleteCartItemByID } from '../../apis/cartItemApi';
// others
import config from '../../config';
import {
    deleteNumberProductCart,
    selectProductsCart,
    selectToTalPriceCart,
    selectToTalProductCart,
    setItemsOfCart,
    setToTalPriceCart,
    setProductsPurchase,
} from './cartSlice';
import { convertNumberToVND } from '../../utils/convertData';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const totalProduct = useSelector(selectToTalProductCart);
    const totalPrice = useSelector(selectToTalPriceCart);
    const products = useSelector(selectProductsCart);
    const { t } = useTranslation('cart');

    const [productsSelect, setProductsSelect] = useState<IProductCart[]>([]);

    const getListProduct = async () => {
        try {
            const response = await getCartByToken();

            if (response.status === 200) {
                dispatch(setItemsOfCart(response?.data?.cartItems));
                dispatch(setToTalPriceCart(response?.data?.totalPrice));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeItemQuantity = async (idItemInCart: number, quantity: number) => {
        try {
            const itemChange = await changeItemQuantity(idItemInCart, quantity);

            if (itemChange.status !== 200) {
                toast.error(itemChange.data.message);
            } else {
                getListProduct();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteProduct = async (idItemInCart: number) => {
        try {
            const response = await deleteCartItemByID(idItemInCart);
            if (response.status === 200) {
                dispatch(deleteNumberProductCart(1));
                getListProduct();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRedirectDetailItem = async (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
            const actionClick: actionProduct = 'click';
            await updateProductAnalysis(idProduct, actionClick);
        }
    };

    const handleAddProductPurchase = (event: React.ChangeEvent<HTMLInputElement>, item: IProductCart) => {
        event.target.checked
            ? setProductsSelect((prev) => [...prev, item])
            : setProductsSelect((prev) => prev.filter((product) => product.id != item.id));
    };

    const handleAddAllProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.checked ? setProductsSelect(products) : setProductsSelect([]);
    };

    const handleDeleteAllProduct = async () => {
        const productsInCart = products.filter((item1) => !productsSelect.some((item2) => item1.id === item2.id));

        await Promise.all([productsSelect.map(async (item) => await deleteCartItemByID(item.id))]);

        dispatch(setItemsOfCart(productsInCart));
        dispatch(deleteNumberProductCart(productsSelect.length));
    };

    const handleNavigateCheckout = () => {
        navigate(config.Routes.checkOut);
        dispatch(setProductsPurchase(productsSelect));
    };

    return (
        <div className="bg-gray-100 py-16 dark:bg-dark-400">
            <div
                className={`${
                    productsSelect.length <= 0 ? 'hidden' : 'block'
                } fixed bottom-0 bg-white dark:bg-dark-600 w-full h-20 z-10`}
            >
                <div className="w-11/12 sm:w-10/12 m-auto flex items-center h-full">
                    <Button
                        className={`${
                            productsSelect.length <= 0
                                ? ''
                                : '!bg-red-500 dark:!bg-red-600 border-2 border-red-500 dark:border-red-600'
                        }`}
                        variant="fill"
                        disabled={productsSelect.length <= 0}
                        onClick={handleDeleteAllProduct}
                    >
                        {t('deleteSelected')}
                    </Button>
                </div>
            </div>
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
                        {products.map((item: IProductCart, index) => (
                            <div className="flex items-center" key={item.id}>
                                <AnimationTran
                                    tranY={100}
                                    className="size-full grid grid-cols-12 gap-1 bg-white rounded-lg overflow-hidden dark:bg-dark-600"
                                    delay={(index % 4) / 20}
                                >
                                    <>
                                        <div className="col-span-1 flex items-center justify-center">
                                            <Checkbox
                                                checked={productsSelect.includes(item)}
                                                onChange={(e) => handleAddProductPurchase(e, item)}
                                            />
                                        </div>
                                        <Image
                                            src={item.imageUrl}
                                            alt={'image' + item.product.name}
                                            className="col-span-3 md:col-span-2 object-cover object-center size-full cursor-pointer"
                                            onClick={() => handleRedirectDetailItem(item.product.id)}
                                        />
                                        <div className="col-span-8 md:col-span-9 text-sm flex flex-col justify-between p-3 sm:p-4">
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
                                                <div className="w-full flex items-center gap-3 sm:w-fit justify-between">
                                                    <ChangeQuantityProduct
                                                        valueQuantity={item.quantity}
                                                        idItem={item.id}
                                                        handleChangeItemQuantity={handleChangeItemQuantity}
                                                    />
                                                    <MouseOverPopover content={t('deleteProduct')}>
                                                        <IconButton onClick={() => handleDeleteProduct(item.id)}>
                                                            <DeleteTwoTone className="!text-red-500" />
                                                        </IconButton>
                                                    </MouseOverPopover>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                </AnimationTran>
                            </div>
                        ))}
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
    );
};

export default Cart;
