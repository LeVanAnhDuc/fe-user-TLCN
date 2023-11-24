import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { Fragment, useEffect, useState } from 'react';
import { getHistoryOrderForCurrentUser } from '../../../apis/orderApi';
import IOrder from '../../../interface/order';
import Image from '../../../components/Image';

// import Pagination from '@mui/material/Pagination';

function Row(props: { item: IOrder }) {
    const { item } = props;
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: open ? '#FFF8EA' : '' }}>
                <TableCell component="th" scope="row">
                    {item.createdDate}
                </TableCell>
                <TableCell align="left">{item.totalItems}</TableCell>
                <TableCell align="left">
                    <div className="text-base not-italic font-medium text-red-500 flex ">
                        <span className="text-sm pr-0.5">đ</span>

                        {item.total.toLocaleString('vi-VN')}
                    </div>
                </TableCell>
                <TableCell align="left">{item.status}</TableCell>
                <TableCell>
                    <Button variant="outlined" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <div>
                                <Typography fontWeight={600} component="span">
                                    Địa chỉ nhận hàng:{' '}
                                </Typography>
                                <Typography component="span">
                                    {item.address.orderDetails}, {item.address.ward}, {item.address.district},
                                    {item.address.city}
                                </Typography>
                            </div>
                            <div>
                                <Typography fontWeight={600} component="span">
                                    Hình thức thanh toán:{' '}
                                </Typography>
                                <Typography component="span">{item.paymentType}</Typography>
                            </div>
                            <div>
                                <Typography fontWeight={600} component="span">
                                    Ghi chú:{' '}
                                </Typography>
                                <Typography component="span">{item.note}</Typography>
                            </div>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell align="left">Tên</TableCell>
                                        <TableCell align="center">Số lượng</TableCell>
                                        <TableCell align="left">Giá cho 1 sản phẩm</TableCell>
                                        <TableCell align="left">Tổng giá</TableCell>
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
                                                <Image
                                                    src={item2.imageUrl}
                                                    className="sm:h-24 sm:w-24 lg:h-36 lg:w-36  h-16 w-16"
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                <div className="text-md font-medium">{item2.product.name}</div>
                                                {item2.sku.optionValues.map((item3, index3) => (
                                                    <span key={index3}>{item3.valueName} </span>
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

const PurchaseHistory = () => {
    const [listHistory, setListHistory] = useState<Array<IOrder>>([]);

    const handleGetListHistory = async () => {
        const response = await getHistoryOrderForCurrentUser();

        setListHistory(response.data);
    };
    useEffect(() => {
        handleGetListHistory();
    }, []);

    return (
        <div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ngày xuất đơn</TableCell>
                                <TableCell align="left">Tổng sản phẩm</TableCell>
                                <TableCell align="left">Thành tiền</TableCell>
                                <TableCell align="left">Trạng thái</TableCell>
                                <TableCell>Chi tiết</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listHistory.map((item: IOrder, index) => (
                                <Row key={index} item={item} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default PurchaseHistory;
