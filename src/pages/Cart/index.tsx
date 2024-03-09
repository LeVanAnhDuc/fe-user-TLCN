import IconButton from '@mui/material/IconButton';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';

import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Image from '../../components/Image';
import config from '../../config';
import { getCartByToken } from '../../apis/cartApi';
import IProductCart from '../../interface/productCart';
import { changeItemQuantity, deleteCartItemByID } from '../../apis/cartItemApi';
import ChangeQuantityProduct from './ChangeQuantityProduct';
import {
    deleteNumberProductCart,
    selectProductsCart,
    selectToTalPriceCart,
    selectToTalProductCart,
    setItemsOfCart,
    setToTalPriceCart,
} from './cartSlice';
import MouseOverPopover from '../../components/MouseOverPopover';
import { convertNumberToVND } from '../../utils/convertData';
import Button from '../../components/Button';
import AnimationTran from '../../components/AnimationTran';
import AnimationScale from '../../components/AnimationScale';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const totalProduct = useSelector(selectToTalProductCart);
    const totalPrice = useSelector(selectToTalPriceCart);
    const products = useSelector(selectProductsCart);

    const getListProduct = async () => {
        try {
            const response = await getCartByToken();
            console.log('check');

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

    const handleRedirectDetailItem = (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
        }
    };

    return (
        <div className="bg-gray-100 py-16 dark:bg-dark-400">
            <div className="grid lg:grid-cols-11 xl:grid-cols-12 gap-5 w-11/12 sm:w-10/12 m-auto">
                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="space-y-4">
                        {products.map((item: IProductCart, index) => (
                            <AnimationTran
                                tranY={100}
                                key={index}
                                className="size-full grid grid-cols-12 gap-1 bg-white rounded-lg overflow-hidden dark:bg-dark-600"
                                delay={(index % 4) / 20}
                            >
                                <>
                                    <Image
                                        src={item.imageUrl}
                                        alt={'image' + item.product.name}
                                        className="col-span-3 md:col-span-2 object-cover object-center size-full cursor-pointer"
                                        onClick={() => handleRedirectDetailItem(item.product.id)}
                                    />
                                    <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between p-3 sm:p-4">
                                        <div className="line-clamp-2 font-semibold mb-3">{item.product.name}</div>
                                        <div className="flex justify-between items-center flex-wrap gap-1">
                                            <aside>
                                                <div className="flex gap-1">
                                                    <span className="font-bold w-18">Phân loại:</span>
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
                                                    <span className="font-bold w-18">Đơn giá: </span>
                                                    <span className="not-italic font-medium text-red-500 flex gap-1">
                                                        {convertNumberToVND(item.price)}
                                                        <span className="text-xs"> đ</span>
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <span className="font-bold w-18">Tổng giá:</span>
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
                                                <MouseOverPopover content="Bỏ khỏi giỏ hàng">
                                                    <IconButton onClick={() => handleDeleteProduct(item.id)}>
                                                        <DeleteTwoTone className="!text-red-500" />
                                                    </IconButton>
                                                </MouseOverPopover>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </AnimationTran>
                        ))}
                    </div>
                    {products.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center gap-5">
                            <ContentPasteSearch sx={{ fontSize: '100px' }} className="text-gray-400" />
                            <span className="text-xl text-gray-400">
                                Hix. Không có sản phẩm nào. Bạn ghé cửa hàng để đặt đồ nhé?
                            </span>
                            <Link to={config.Routes.shop}>
                                <Button variant="fill">Cửa hàng</Button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3 sticky top-20 bg-white h-fit w-full p-5 rounded-lg space-y-5 dark:bg-dark-600">
                    <h1 className="text-2xl font-bold text-center">Tổng chi phí</h1>
                    <div className="flex flex-wrap justify-between gap-1">
                        <span className="font-semibold">Tổng tiền</span>
                        <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                            <>
                                {convertNumberToVND(totalPrice)}
                                <span className="text-sm">đ</span>
                            </>
                        </AnimationScale>
                    </div>
                    <div className="flex flex-wrap justify-between gap-1">
                        <span className="font-semibold">Phí vận chuyển</span>
                        <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                            <>
                                {0}
                                <span className="text-sm">đ</span>
                            </>
                        </AnimationScale>
                    </div>
                    <div className="h-0.5 bg-gray-200 w-full"></div>
                    <div className="flex flex-wrap justify-between gap-1">
                        <span className="font-semibold">Thành tiền</span>
                        <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                            <>
                                {convertNumberToVND(totalPrice + 0)}
                                <span className="text-sm">đ</span>
                            </>
                        </AnimationScale>
                    </div>
                    <div className="h-0.5 bg-gray-200 w-full"></div>

                    <Button
                        variant="fill"
                        fullWidth
                        disabled={totalProduct === 0}
                        onClick={() => {
                            navigate(config.Routes.checkOut);
                        }}
                    >
                        Thanh toán
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
