// libs
import IconButton from '@mui/material/IconButton';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React from 'react';
// types
import IProductCart from '@/types/productCart';
import { actionProduct } from '@/types/product';
// components
import Image from '@/components/Image';
import MouseOverPopover from '@/components/MouseOverPopover';
import AnimationTran from '@/components/AnimationTran';
import QuantityProduct from '../../components/QuantityProduct';
// apis
import { updateProductAnalysis } from '@/apis/productApi';
import { changeItemQuantity, deleteCartItemByID } from '@/apis/cartItemApi';
import { getCartByToken } from '@/apis/cartApi';
// redux
import { deleteNumberProductCart, selectProductsCart, setItemsOfCart, setToTalPriceCart } from '../../cartSlice';
// others
import config from '@/config';
import { convertNumberToVND } from '@/utils/convertData';

const ProductsCart = ({
    productsSelect,
    setProductsSelect,
    productsQuantityFull,
}: {
    productsSelect: IProductCart[];
    setProductsSelect: React.Dispatch<React.SetStateAction<IProductCart[]>>;
    productsQuantityFull: {
        id: number;
        quantityAvailable: number;
    }[];
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation('cart');
    const products: IProductCart[] = useSelector(selectProductsCart);

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

    const handleAddProductPurchase = (event: React.ChangeEvent<HTMLInputElement>, item: IProductCart) => {
        event.target.checked
            ? setProductsSelect((prev) => [...prev, item])
            : setProductsSelect((prev) => prev.filter((product) => product.id != item.id));
    };

    const handleRedirectDetailItem = async (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
            const actionClick: actionProduct = 'click';
            await updateProductAnalysis(idProduct, actionClick);
        }
    };

    const handleDeleteProduct = async (idItemInCart: number) => {
        try {
            const response = await deleteCartItemByID(idItemInCart);
            if (response.status === 200) {
                dispatch(deleteNumberProductCart(1));
                setProductsSelect((prev) => prev.filter((item) => item.id !== idItemInCart));
                getListProduct();
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

            setProductsSelect((prev) =>
                prev.map((item) => {
                    if (item.id === idItemInCart) {
                        return {
                            ...item,
                            quantity: quantity,
                        };
                    }
                    return item;
                }),
            );

            if (itemChange.status !== 200) {
                toast.error(itemChange.data.message);
            } else {
                getListProduct();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
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
                                    checked={productsSelect.some((product) => product.id === item.id)}
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
                                                        {index < item.sku.optionValues.length - 1 ? ' - ' : ''}
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
                                        <QuantityProduct
                                            valueQuantity={item.quantity}
                                            idItem={item.id}
                                            handleChangeItemQuantity={handleChangeItemQuantity}
                                            productQuantityFull={
                                                productsQuantityFull.filter((product) => product.id === item.id)[0]
                                            }
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
        </>
    );
};

export default ProductsCart;
