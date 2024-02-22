import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import Image from '../../components/Image';
import config from '../../config';
import { getCartByToken } from '../../apis/cartApi';
import IProductCart from '../../interface/productCart';
import { changeItemQuantity, deleteCartItemByID } from '../../apis/cartItemApi';

import QuantityProduct from './QuantityProduct';
import DeleteProduct from './DeleteProduct';

import { getCountItemOfCart } from '../../apis/cartApi';
import { useDispatch } from 'react-redux';
import { setToTalProductCart } from './totalProducCartSlice';
import MouseOverPopover from '../../components/MouseOverPopover';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [listProduct, setListProduct] = useState<Array<IProductCart>>([]);
    const getListProduct = async () => {
        const response = await getCartByToken();

        if (response.status === 200) {
            setListProduct(response?.data?.cartItems);
            setTotalPrice(response?.data?.totalPrice);
        } else {
            toast.error(response.data.message);
        }
    };
    useEffect(() => {
        getListProduct();
    }, [isLoading]);

    const handleChangeItemQuantity = async (idItemInCart: number, quantity: number) => {
        const response = await changeItemQuantity(idItemInCart, quantity);
        if (response.status !== 200) {
            toast.error(response.data.message);
        }
        setIsLoading((prev) => !prev);
    };
    const handleDeleteProduct = async (idItemInCart: number) => {
        const response = await deleteCartItemByID(idItemInCart);
        getTotalItemOfCart();
        if (response.status === 200) {
            toast.success(response.data);
        } else {
            toast.error(response.data.message);
        }
        setIsLoading((prev) => !prev);
    };

    // handle số lượng sản phẩm trong giỏ hàng
    const getTotalItemOfCart = async () => {
        const totalProductInCart = await getCountItemOfCart();
        if (totalProductInCart.status === 200) {
            dispatch(setToTalProductCart(+totalProductInCart.data));
        }
    };
    // chi tiet san pham
    const handleNextDetailPage = (idProduct: number) => {
        if (idProduct) {
            navigate(config.Routes.detailProduct + '#' + idProduct);
        } else {
            toast.error('Đang bảo trì');
        }
    };
    // get số lượng sản phẩm trong giỏ hàng
    const totalProductLocalStorage: string | null = localStorage.getItem('totalProductInCart');
    const [totalProduct, setTotalProduct] = useState<number>(0);

    useEffect(() => {
        if (totalProductLocalStorage) {
            setTotalProduct(+totalProductLocalStorage);
        }
    }, [totalProductLocalStorage]);

    return (
        <div className="w-10/12 m-auto pt-32">
            <div className="grid grid-cols-12 gap-2">
                {/* start list product */}
                <div className="col-span-12 lg:col-span-9 ">
                    <div className="h-min bg-[#F5F5F5] px-6 py-3 mb-5 rounded">
                        <div className="font-semibold text-lg">Miễn phí vận chuyển</div>
                        <span className="text-sm text-gray-500">
                            Áp dụng cho đơn đặt hàng từ 5.000.000 VNĐ trở lên.
                        </span>
                        <a href="#" className="text-sm ml-5 underline text-gray-700 hover:text-black">
                            Xem chi tiết
                        </a>
                    </div>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 610 }}>
                            <Table stickyHeader aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell align="left">Sản phẩm</TableCell>
                                        <TableCell align="center">Số lượng</TableCell>
                                        <TableCell align="left">Giá</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listProduct.map((item: IProductCart, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    minWidth: '100px',
                                                }}
                                                onClick={() => handleNextDetailPage(item.product.id)}
                                            >
                                                <Image
                                                    src={item.imageUrl}
                                                    className="sm:h-24 sm:w-24 lg:h-30 lg:w-30  h-16 w-16"
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                {item.product.name}
                                                <div>
                                                    <span className="font-semibold text-base">Phân loại: </span>
                                                    {item.sku?.optionValues?.map((option, index) => (
                                                        <React.Fragment key={index}>
                                                            {option.valueName}
                                                            {index < item.sku.optionValues.length - 1 ? ' - ' : ''}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <QuantityProduct
                                                    valueQuantity={item.quantity}
                                                    idItem={item.id}
                                                    handleChangeItemQuantity={handleChangeItemQuantity}
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                <div className="text-base not-italic font-medium text-red-500 flex ">
                                                    <span className="text-sm pr-0.5">đ</span>
                                                    {item.subTotal.toLocaleString('vi-VN')}
                                                </div>
                                            </TableCell>
                                            <TableCell align="left">
                                                <MouseOverPopover content="Xóa sản phẩm khỏi giỏ hàng">
                                                    <DeleteProduct
                                                        idItem={item.id}
                                                        handleDeleteProduct={handleDeleteProduct}
                                                    />
                                                </MouseOverPopover>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
                {/* end list product */}
                {/* start bill */}
                <div className="col-span-12 mt-10 lg:mt-0 lg:col-span-3 lg:ml-10 space-y-5">
                    <h1 className="text-2xl font-semibold text-center">Tổng chi phí</h1>
                    <div className="grid grid-cols-3">
                        <span className="text-left col-span-2">Tổng tiền</span>
                        <span className="text-right text-red-500 flex justify-end">
                            <span className="text-sm pr-0.5">đ</span>
                            {totalPrice.toLocaleString('vi-VN')}
                        </span>
                    </div>
                    <div className="grid grid-cols-3">
                        <span className="text-left col-span-2">Phí vận chuyển</span>
                        <span className="text-right text-red-500 flex justify-end">
                            <span className="text-sm pr-0.5">đ</span>
                            {0}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 relative py-10">
                        <span className="absolute left-0 top-5 h-0.5 bg-gray-200 w-full"></span>

                        <span className="text-left col-span-2">Thành tiền</span>
                        <span className="text-right text-red-500 flex justify-end">
                            <span className="text-sm pr-0.5">đ</span>
                            {(totalPrice + 0).toLocaleString('vi-VN')}
                        </span>

                        <span className="absolute left-0 bottom-5 h-0.5 bg-gray-200 w-full"></span>
                    </div>
                    {totalProduct === 0 ? (
                        <Button variant="contained" fullWidth size="large" disabled>
                            Thanh toán
                        </Button>
                    ) : (
                        <Link to={config.Routes.checkOut}>
                            <Button variant="contained" fullWidth color="primary" size="large">
                                Thanh toán
                            </Button>
                        </Link>
                    )}
                </div>
                {/* end bill */}
            </div>
        </div>
    );
};

export default Cart;
