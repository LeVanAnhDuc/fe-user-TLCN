import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import Favorite from '@mui/icons-material/Favorite';

import Image from '../../../components/Image';
import { getCountItemOfWishList, getWishListWithPagination, putFollowProduct } from '../../../apis/followProductApi';
import IFollowProduct from '../../../interface/followProduct';
import config from '../../../config';
import MouseOverPopover from '../../../components/MouseOverPopover';
import { setToTalWishList } from './wishListSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#B3A492',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: 3,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Wishlist = () => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState<boolean>(false);
    // change page
    const [data, setData] = useState<Array<IFollowProduct>>([]); // Dữ liệu từ API
    const [page, setPage] = useState<number>(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(11); // Tổng số trang
    const itemsPerPage = 20;

    const getAllFollowProduct = async (pageNo: number) => {
        try {
            const response = await getWishListWithPagination(pageNo, itemsPerPage);
            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setData(content);
                setTotalPages(totalPages);
            } else {
                toast.error('Lỗi server');
            }
        } catch (error) {
            toast.error('Đang bảo trì quay lại sau');
        }
    };

    const handleToggleFavourite = async (itemProduct: number) => {
        await putFollowProduct(itemProduct);
        const response = await getCountItemOfWishList();
        dispatch(setToTalWishList(+response.data));
        setLoading((prev) => !prev);
    };

    useEffect(() => {
        getAllFollowProduct(page);
    }, [page, isLoading]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };
    return (
        <div className="mt-10">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell align="left">Sản phẩm</StyledTableCell>
                                <StyledTableCell align="left">Giá</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell component="th" scope="row">
                                        <Link to={config.Routes.detailProduct + '#' + item.product.productId}>
                                            <Image
                                                src={item.product.imageUrl}
                                                className="sm:h-24 sm:w-24 lg:h-32 lg:w-32  h-16 w-16 p-3"
                                            />
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{item.product.name}</StyledTableCell>
                                    <StyledTableCell align="left">
                                        <div className="text-lg not-italic font-medium  text-red-500 flex items-center">
                                            <span className="text-sm pr-1">đ</span>
                                            <span>{item.product.price.toLocaleString('vi-VN')}</span>
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        <Link to={config.Routes.detailProduct + '#' + item.product.productId}>
                                            <IconButton>
                                                <MouseOverPopover content="Mua sản phẩm">
                                                    <ShoppingCartOutlined sx={{ fontSize: 26 }} />
                                                </MouseOverPopover>
                                            </IconButton>
                                        </Link>
                                        <IconButton onClick={() => handleToggleFavourite(item.product.productId)}>
                                            <MouseOverPopover content="Hủy thích">
                                                <Favorite sx={{ color: 'red', fontSize: 26 }} />
                                            </MouseOverPopover>
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <div className="w-full flex justify-center my-5">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    boundaryCount={1}
                />
            </div>
        </div>
    );
};

export default Wishlist;
