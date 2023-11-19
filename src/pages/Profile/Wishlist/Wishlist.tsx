import S2Baner1 from '../../../assets/img/LandingPage/section-2-1.png';
import S2Baner2 from '../../../assets/img/LandingPage/section-2-2.png';
import S2Baner3 from '../../../assets/img/LandingPage/section-2-3.png';
import S2Baner4 from '../../../assets/img/LandingPage/section-2-4.png';
import S4Baner1 from '../../../assets/img/LandingPage/section-4-1.png';
import S4Baner2 from '../../../assets/img/LandingPage/section-4-2.png';
import S4Baner3 from '../../../assets/img/LandingPage/section-4-3.png';
import Image from '../../../components/Image';

import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';

import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

interface ProductWishlist {
    image: string;
    name: string;
    size: string;
    color: string;
    price: number;
}

const rows: Array<ProductWishlist> = [
    { image: S2Baner1, name: 'Name Product', size: 'L', color: 'red', price: 100 },
    { image: S2Baner2, name: 'Name Product', size: 'L', color: 'red', price: 100 },
    { image: S2Baner3, name: 'Name Product', size: 'L', color: 'red', price: 100 },
    { image: S2Baner4, name: 'Name Product', size: 'L', color: 'red', price: 100 },
    { image: S4Baner1, name: 'Name Product', size: 'L', color: 'red', price: 100 },
    { image: S4Baner2, name: 'Name Product', size: 'L', color: 'red', price: 100 },
    { image: S4Baner3, name: 'Name Product', size: 'L', color: 'red', price: 100 },
];

const isFavourite = true;
const Wishlist = () => {
    // change page
    // const [data, setData] = useState([]); // Dữ liệu từ API
    const [page, setPage] = useState(1); // Trang hiện tại
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [totalPages, setTotalPages] = useState(11); // Tổng số trang

    useEffect(() => {
        // Gọi API để lấy dữ liệu
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        console.log(event);

        setPage(newPage);
    };
    return (
        <div className="mt-10">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 540 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell align="left">Tên</TableCell>
                                <TableCell align="left">Đơn giá</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((item, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Image
                                            src={item.image}
                                            className="sm:h-24 sm:w-24 lg:h-36 lg:w-36  h-16 w-16"
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <div className="text-xl font-medium">{item.name}</div>
                                        <span>Size: {item.size}</span>
                                        <span className="pl-5">Color: {item.color}</span>
                                    </TableCell>
                                    <TableCell align="left">{item.price} $</TableCell>
                                    <TableCell align="left">
                                        <IconButton>
                                            +<ShoppingCartOutlined sx={{ fontSize: 26 }} />
                                        </IconButton>
                                        <IconButton>
                                            {isFavourite ? (
                                                <Favorite sx={{ color: 'red', fontSize: 26 }} />
                                            ) : (
                                                <FavoriteBorder sx={{ fontSize: 26 }} />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
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
