import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { updateOrderStatusByID } from '../../../../apis/orderApi';
import Image from '../../../../components/Image';
import MouseOverPopover from '../../../../components/MouseOverPopover';
import ModalReview from '../ModalReview/ModalReview';
import IOrder from '../../../../interface/order';
import config from '../../../../config';
import IProductCart from '../../../../interface/productCart';

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

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.action.hover,
        backgroundColor: '#F3EEEA',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
interface Iprops {
    item: IOrder;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RowTable(props: Iprops) {
    const navigate = useNavigate();
    const { item, setLoading } = props;
    const [open, setOpen] = useState(true);

    const handleCancelOrder = async (id: number) => {
        const userConfirmed = window.confirm('Bạn có chắc chắn muốn hủy không?');
        if (userConfirmed) {
            try {
                const response = await updateOrderStatusByID(id, config.StatusOrders.CANCELED);

                if (response.status === 200) {
                    toast.success('Đã hủy đơn hàng');
                    setLoading((prev) => !prev);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            toast.info('Hủy xóa');
        }
    };

    const handlePaymentOrder = async (idOder: number) => {
        navigate(config.Routes.checkOut + '#' + idOder);
    };

    // modal
    const [openReview, setOpenReview] = useState(false);
    const [itemCart, setItemCart] = useState<IProductCart>();
    const handleOpenReview = (item: IProductCart) => {
        setItemCart(item);
        setOpenReview(true);
    };
    const handleCloseReview = () => setOpenReview(false);

    return (
        <>
            {/* model danh gia */}
            <ModalReview
                open={openReview}
                handleClose={handleCloseReview}
                orderItem={itemCart}
                setLoading={setLoading}
            />
            {/*  */}
            <StyledTableRow
                sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                }}
            >
                <StyledTableCell align="center" component="th" scope="row">
                    {item.createdDate}
                </StyledTableCell>
                <StyledTableCell align="center">{item.totalItems}</StyledTableCell>
                <StyledTableCell align="center">
                    <div className="text-base not-italic font-medium text-red-500 flex ">
                        <span className="text-sm pr-0.5">đ</span>

                        {item.total.toLocaleString('vi-VN')}
                    </div>
                </StyledTableCell>
                <StyledTableCell align="left">
                    <span
                        className={`${
                            item.status === config.StatusOrders.DELIVERED
                                ? 'text-green-600 text-base font-semibold'
                                : ''
                        }
                        ${
                            item.status === config.StatusOrders.WAITFORPAY ? 'text-red-600 text-base font-semibold' : ''
                        } font-medium `}
                    >
                        {item.status}
                    </span>
                </StyledTableCell>
                <StyledTableCell>
                    <Button variant="outlined" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Button>
                </StyledTableCell>
                <StyledTableCell>
                    {/* <IconButton onClick={() => navigate(config.Routes.detailOrder + '#' + item.id)}>
                        <MouseOverPopover content="Xem thông tin chi tiết">
                            <InfoTwoTone sx={{ color: '#0802A3', fontSize: 26 }} />
                        </MouseOverPopover>
                    </IconButton> */}
                    <Button
                        onClick={() => navigate(config.Routes.detailOrder + '#' + item.id)}
                        variant="contained"
                        sx={{
                            bgcolor: 'blue',
                            marginLeft: 1,
                            ':hover': {
                                bgcolor: '#2B2A4C',
                            },
                        }}
                    >
                        <MouseOverPopover content="Hủy đơn hàng">
                            <span className="normal-case text-white text-base">Chi tiết</span>
                        </MouseOverPopover>
                    </Button>

                    {(item.status === config.StatusOrders.ORDERED ||
                        item.status === config.StatusOrders.WAITFORPAY) && (
                        <Button
                            onClick={() => handleCancelOrder(item.id)}
                            variant="contained"
                            sx={{
                                bgcolor: 'red',
                                marginLeft: 1,
                                ':hover': {
                                    bgcolor: '#2B2A4C',
                                },
                            }}
                        >
                            <MouseOverPopover content="Hủy đơn hàng">
                                <span className="normal-case text-white text-base">Huỷ đơn</span>
                            </MouseOverPopover>
                        </Button>
                    )}
                </StyledTableCell>
            </StyledTableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, paddingBottom: 10 }}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell align="left">Tên</TableCell>
                                        <TableCell align="center">Số lượng</TableCell>
                                        <TableCell align="left">Giá cho 1 sản phẩm</TableCell>
                                        <TableCell align="left">Tổng giá</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {item?.orderItems.map((item2, index2) => (
                                        <TableRow
                                            key={index2}
                                            sx={{
                                                '&:last-child td, &:last-child th': {
                                                    border: 0,
                                                },
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Link to={config.Routes.detailProduct + '#' + item2.product.id}>
                                                    <div className="h-16 w-16 sm:h-24 sm:w-24 lg:h-36 lg:w-36 overflow-hidden">
                                                        <Image
                                                            src={item2.imageUrl}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell align="left">
                                                <div className="text-md font-medium">{item2.product.name}</div>
                                                <span className="font-semibold text-base">Phân loại: </span>

                                                {item2.sku.optionValues.map((item3, index3) => (
                                                    <span key={index3}>
                                                        {item3.valueName}
                                                        {index3 < item2.sku.optionValues.length - 1 ? ' - ' : ''}
                                                    </span>
                                                ))}
                                            </TableCell>
                                            <TableCell align="center">{item2.quantity} </TableCell>
                                            <TableCell align="left">
                                                <div className="text-base not-italic font-medium text-red-500 flex ">
                                                    <span className="text-sm pr-0.5">đ</span>
                                                    <span> {item2.price.toLocaleString('vi-VN')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="left">
                                                <div className="text-base not-italic font-medium text-red-500 flex">
                                                    <span className="text-sm pr-0.5">đ</span>
                                                    <span> {item2.subTotal.toLocaleString('vi-VN')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item2.hasReview && (
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleOpenReview(item2)}
                                                        sx={{ width: '110px' }}
                                                    >
                                                        Đánh giá
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-10">
                                <div className="pl-5">
                                    <div className="pb-2">
                                        <Typography fontWeight={600} component="span">
                                            Địa chỉ nhận hàng:
                                        </Typography>
                                        <Typography component="span">
                                            {' '}
                                            {item.address.orderDetails}, {item.address.ward},{item.address.district},{' '}
                                            {item.address.city}
                                        </Typography>
                                    </div>
                                    <div className="pb-2">
                                        <Typography fontWeight={600} component="span">
                                            Phương thức thanh toán:
                                        </Typography>
                                        <Typography component="span"> {item.paymentType}</Typography>
                                    </div>
                                    <div>
                                        <Typography fontWeight={600} component="span">
                                            Ghi chú:
                                        </Typography>
                                        <Typography component="span"> {item.note}</Typography>
                                    </div>
                                </div>
                                {item.status === config.StatusOrders.WAITFORPAY && (
                                    <Button
                                        onClick={() => handlePaymentOrder(item.id)}
                                        variant="contained"
                                        sx={{
                                            marginLeft: 1,
                                            ':hover': {
                                                bgcolor: '#2B2A4C',
                                            },
                                            height: '40px',
                                        }}
                                    >
                                        <MouseOverPopover content="Thanh toán đơn hàng">
                                            <span className="normal-case text-white text-base">Thanh toán</span>
                                        </MouseOverPopover>
                                    </Button>
                                )}
                                {item.isPaidBefore && (
                                    <Box>
                                        <span className="normal-case text-base">Đã thanh toán</span>
                                    </Box>
                                )}
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <div className="h-10"></div>
        </>
    );
}
