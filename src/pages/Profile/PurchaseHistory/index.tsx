import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { searchOrderForUser, updateOrderStatusByID } from '../../../apis/orderApi';
import IOrder from '../../../interface/order';
import config from '../../../config';
import Image from '../../../components/Image';
import AnimationTran from '../../../components/AnimationTran';
import { convertNumberToVND } from '../../../utils/convertData';
import Button from '../../../components/Button';
import Error404 from '../../Error404';
import ModalReview from './ModalReview';
import IProductCart from '../../../interface/productCart';
import Loading from '../../../components/Loading';
import { initObjecProductCart } from '../../../constants';

const PurchaseHistory = () => {
    const navigate = useNavigate();

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [listHistory, setListHistory] = useState<Array<IOrder>>([]);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [callAPIAgain, setCallAPIAgain] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [statusOrder, setStatusOrder] = useState<string>('');
    const [openReview, setOpenReview] = useState(false);
    const [itemReview, setItemReview] = useState<IProductCart>(initObjecProductCart);

    const handleChangeStatus = (event: SelectChangeEvent) => {
        setStatusOrder(event.target.value as string);
    };
    const handleGetListHistory = async (statusParam: string) => {
        try {
            firstLoadingAPI && setLoadingAPI(true);

            const [response] = await Promise.all([
                searchOrderForUser(statusParam),
                firstLoadingAPI && new Promise((resolve) => setTimeout(resolve, 250)),
            ]);

            firstLoadingAPI && setLoadingAPI(false);

            if (response?.status === 200) {
                setFirstLoadingAPI(false);
                setListHistory(response.data);
            } else {
                setErrorAPI(true);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    const handleRedirectDetailItem = (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
        }
    };

    const handlePaymentOrder = async (idOder: number) => {
        if (idOder) {
            navigate(config.Routes.checkOut, { state: { idOder: idOder } });
        }
    };

    const handleCancelOrder = async (idProduct: number) => {
        const userConfirmed = window.confirm('Bạn có chắc chắn muốn hủy không?');
        if (userConfirmed) {
            try {
                const response = await updateOrderStatusByID(idProduct, config.StatusOrders.CANCELED);

                if (response.status === 200) {
                    handleGetListHistory(statusOrder);
                    toast.success('Đã hủy đơn hàng');
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                setErrorAPI(true);
            }
        } else {
            toast.info('Hủy xóa');
        }
    };

    const handleOpenReview = (item: IProductCart) => {
        setItemReview(item);
        setOpenReview(true);
    };
    const handleCloseReview = () => setOpenReview(false);

    useEffect(() => {
        handleGetListHistory(statusOrder);
    }, [statusOrder, callAPIAgain]);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <ModalReview
                open={openReview}
                handleClose={handleCloseReview}
                orderItem={itemReview}
                setCallAPIAgain={setCallAPIAgain}
            />
            {isLoadingAPI ? (
                <Loading />
            ) : (
                <>
                    <div className="flex items-center font-medium text-lg pb-5 gap-3 ">
                        <span>Lọc đơn hàng:</span>
                        <FormControl sx={{ width: 200 }} size="small">
                            <InputLabel>Trạng thái</InputLabel>
                            <Select value={statusOrder} label="Trạng thái" onChange={handleChangeStatus}>
                                <MenuItem value={''}>Tất cả</MenuItem>
                                <MenuItem value={config.StatusOrders.ORDERED}>{config.StatusOrders.ORDERED}</MenuItem>
                                <MenuItem value={config.StatusOrders.PROCESSING}>
                                    {config.StatusOrders.PROCESSING}
                                </MenuItem>
                                <MenuItem value={config.StatusOrders.SHIPPED}>{config.StatusOrders.SHIPPED}</MenuItem>
                                <MenuItem value={config.StatusOrders.DELIVERED}>
                                    {config.StatusOrders.DELIVERED}
                                </MenuItem>
                                <MenuItem value={config.StatusOrders.CANCELED}>{config.StatusOrders.CANCELED}</MenuItem>
                                <MenuItem value={config.StatusOrders.WAITFORPAY}>
                                    {config.StatusOrders.WAITFORPAY}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="space-y-5">
                        {listHistory.map((item, index) => (
                            <AnimationTran tranY={100} className=" bg-white rounded-lg shadow" key={index}>
                                <div className="flex items-center justify-between p-5">
                                    <div className="text-sm font-bold">{item.createdDate}</div>
                                    <div
                                        className={`
                                ${item.status === config.StatusOrders.DELIVERED && '!text-green-500'}
                                ${item.status === config.StatusOrders.CANCELED && '!text-red-600'} 
                                uppercase font-bold text-primary-700 text-lg`}
                                    >
                                        {item.status}
                                    </div>
                                </div>

                                <div className="space-y-3 px-5">
                                    {item.orderItems.map((itemProduct, indexProduct) => (
                                        <Fragment key={indexProduct}>
                                            <div className="h-0.5 bg-gray-200"></div>
                                            <div className="size-full grid grid-cols-12 gap-1 overflow-hidden">
                                                <>
                                                    <Image
                                                        src={itemProduct.imageUrl}
                                                        alt={'image' + itemProduct.product.name}
                                                        className="col-span-3 md:col-span-2 object-cover object-center size-full cursor-pointer rounded"
                                                        onClick={() => handleRedirectDetailItem(itemProduct.product.id)}
                                                    />
                                                    <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between gap-2 p-3 sm:p-4">
                                                        <div className="line-clamp-2 font-medium">
                                                            {itemProduct.product.name}
                                                        </div>
                                                        <div className="flex justify-between items-center flex-wrap gap-1">
                                                            <div>
                                                                <div className="flex gap-2">
                                                                    <span className="w-18">Phân loại:</span>
                                                                    <span className="font-medium">
                                                                        {itemProduct.sku?.optionValues?.map(
                                                                            (option, index) => (
                                                                                <React.Fragment key={index}>
                                                                                    {option.valueName}
                                                                                    {index <
                                                                                    itemProduct.sku.optionValues
                                                                                        .length -
                                                                                        1
                                                                                        ? ' - '
                                                                                        : ''}
                                                                                </React.Fragment>
                                                                            ),
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span className="w-18">Số lượng:</span>
                                                                    <span className="font-medium">
                                                                        {itemProduct.quantity}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span className="w-18">Đơn giá: </span>
                                                                    <span className="not-italic font-bold text-red-500 flex gap-1">
                                                                        {convertNumberToVND(itemProduct.price)}
                                                                        <span className="text-xs"> đ</span>
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span className="w-18">Tổng giá:</span>
                                                                    <div className="not-italic font-bold text-red-500 flex gap-1">
                                                                        {convertNumberToVND(itemProduct.subTotal)}
                                                                        <span className="text-xs">đ</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {itemProduct.hasReview && (
                                                                    <Button
                                                                        variant="fill"
                                                                        className=" !h-10"
                                                                        onClick={() => handleOpenReview(itemProduct)}
                                                                    >
                                                                        Đánh giá
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>

                                <div className="h-0.5 bg-gray-200 mt-3"></div>

                                <div className="flex justify-between items-center p-5 bg-primary-50/40">
                                    <div className="flex justify-end items-center gap-2">
                                        <span className="font-medium text">Thành tiền:</span>
                                        <div className="not-italic text-xl font-medium text-red-500  flex gap-1">
                                            {convertNumberToVND(item.total)}
                                            <span className="text-lg">đ</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        {item.status === config.StatusOrders.WAITFORPAY && (
                                            <Button
                                                className="!h-10"
                                                variant="fill"
                                                onClick={() => handlePaymentOrder(item.id)}
                                            >
                                                Thanh toán
                                            </Button>
                                        )}
                                        <Button
                                            className="!h-10"
                                            variant="outline"
                                            // onClick={() =>
                                            //     navigate(config.Routes.detailOrder, { state: { idPurchaseHistory: item.id } })
                                            // }
                                        >
                                            Chi tiết
                                        </Button>
                                        {(item.status === config.StatusOrders.ORDERED ||
                                            item.status === config.StatusOrders.WAITFORPAY) && (
                                            <Button
                                                className="!h-10 text-red-500 hover:text-red-800"
                                                variant="text"
                                                onClick={() => handleCancelOrder(item.id)}
                                            >
                                                Hủy đơn
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </AnimationTran>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default PurchaseHistory;
