import Fab from '@mui/material/Fab';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';
import Drawer from '@mui/material/Drawer';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import React from 'react';

import config from '../../config';
import Image from '../../components/Image';
import MouseOverPopover from '../../components/MouseOverPopover';
import IProductCart from '../../interface/productCart';
import { getCartByToken } from '../../apis/cartApi';
import { changeItemQuantity, deleteCartItemByID } from '../../apis/cartItemApi';
import {
    deleteNumberProductCart,
    selectProductsCart,
    selectToTalPriceCart,
    selectToTalProductCart,
    setItemsOfCart,
    setToTalPriceCart,
} from './cartSlice';
import AnimationTran from '../../components/AnimationTran';
import { convertNumberToVND } from '../../utils/convertData';
import ChangeQuantityProduct from './ChangeQuantityProduct';
import Button from '../../components/Button';
import AnimationScale from '../../components/AnimationScale';

interface Iprops {
    openCartModal: boolean;
    toggleDrawerCartModal: () => void;
}
const CartModal = (props: Iprops) => {
    const { openCartModal, toggleDrawerCartModal } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        <Drawer anchor={'right'} open={openCartModal} onClose={toggleDrawerCartModal}>
            <div className="w-screen sm:w-[34rem] min-h-screen  bg-gray-100 ">
                <div className="relative h-full flex flex-col justify-between">
                    <div className="sticky top-0 z-10">
                        <div className="bg-primary-200 w-full h-14 rounded-b-xl dark:bg-primary-600">
                            <div className="flex justify-between items-center mb-10 h-full px-5">
                                <span className="text-xl font-bold tracking-wide">Giỏ hàng</span>
                                <Fab color="error" size="small" className="!shadow-none">
                                    <Close onClick={toggleDrawerCartModal} />
                                </Fab>
                            </div>
                        </div>
                    </div>

                    <div className="py-5 h-full hide-scrollbar overflow-y-scroll">
                        {products.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-5 px-20">
                                <ContentPasteSearch sx={{ fontSize: '100px' }} className="text-gray-400" />
                                <span className="text-xl text-center text-gray-400">
                                    Hix. Không có sản phẩm nào. Bạn ghé cửa hàng để đặt đồ nhé?
                                </span>
                                <Link to={config.Routes.shop}>
                                    <Button variant="fill" onClick={toggleDrawerCartModal}>
                                        Cửa hàng
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3 px-3">
                                {products.map((item: IProductCart, index) => (
                                    <AnimationTran
                                        tranY={100}
                                        key={index}
                                        className="size-full grid grid-cols-12 gap-2 bg-white rounded-lg overflow-hidden shadow p-2"
                                        delay={(index % 4) / 20}
                                    >
                                        <>
                                            <Image
                                                src={item.imageUrl}
                                                alt={'image' + item.product.name}
                                                className="col-span-3 md:col-span-2 object-cover object-center size-fit m-auto cursor-pointer"
                                                onClick={() => {
                                                    handleRedirectDetailItem(item.product.id);
                                                    toggleDrawerCartModal();
                                                }}
                                            />
                                            <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between ">
                                                <div className="line-clamp-1 font-semibold mb-3">
                                                    {item.product.name}
                                                </div>
                                                <div className="flex justify-between items-center flex-wrap gap-1">
                                                    <aside>
                                                        <div className="flex gap-1">
                                                            <span className="font-bold w-18">Phân loại:</span>
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
                        )}
                    </div>

                    <div className="bg-gray-100 border-t-2 border-black">
                        <div className="flex flex-col w-full h-fit px-5 py-2 gap-5">
                            <div className="flex justify-between items-center w-full font-bold">
                                <span className="text-lg">Tổng</span>
                                <AnimationScale scale={0.5} className="text-red-500 flex justify-end">
                                    <>
                                        {convertNumberToVND(totalPrice)}
                                        <span className="text-sm pr-0.5">đ</span>
                                    </>
                                </AnimationScale>
                            </div>
                            <div className="flex justify-between w-full gap-5">
                                <Button
                                    className="rounded-lg"
                                    variant="fill"
                                    fullWidth
                                    onClick={() => {
                                        navigate(config.Routes.cart);
                                        toggleDrawerCartModal();
                                    }}
                                >
                                    Giỏ hàng
                                </Button>
                                <Button
                                    className="rounded-lg"
                                    variant="fill"
                                    fullWidth
                                    disabled={totalProduct === 0}
                                    onClick={() => {
                                        navigate(config.Routes.checkOut);
                                        toggleDrawerCartModal();
                                    }}
                                >
                                    Thanh toán
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default CartModal;
