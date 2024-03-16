import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    const location = useLocation();

    const status = location.state?.status ? location.state.status : '';

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [listHistory, setListHistory] = useState<Array<IOrder>>([]);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [callAPIAgain, setCallAPIAgain] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [statusOrder, setStatusOrder] = useState<string>(status);
    const [openReview, setOpenReview] = useState(false);
    const [itemReview, setItemReview] = useState<IProductCart>(initObjecProductCart);

    const handleChangeStatus = (_: React.MouseEvent<HTMLElement>, status: string) => {
        setStatusOrder(status);
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

    const handleRedirectDetailOrder = (idOrder: number) => {
        if (idOrder) {
            navigate(`${config.Routes.detailOrder}/${idOrder}`);
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
                <section className="space-y-4">
                    <ToggleButtonGroup
                        value={statusOrder}
                        exclusive
                        onChange={handleChangeStatus}
                        fullWidth
                        className="!bg-white dark:!bg-dark-600 min-h-12"
                        color="info"
                    >
                        <ToggleButton className="!text-xs" value={''}>
                            Tất cả
                        </ToggleButton>
                        <ToggleButton className="!text-xs" value={config.StatusOrders.ORDERED}>
                            {config.StatusOrders.ORDERED}
                        </ToggleButton>
                        <ToggleButton className="!text-xs" value={config.StatusOrders.PROCESSING}>
                            {config.StatusOrders.PROCESSING}
                        </ToggleButton>
                        <ToggleButton className="!text-xs" value={config.StatusOrders.SHIPPED}>
                            {config.StatusOrders.SHIPPED}
                        </ToggleButton>
                        <ToggleButton className="!text-xs" value={config.StatusOrders.DELIVERED}>
                            {config.StatusOrders.DELIVERED}
                        </ToggleButton>
                        <ToggleButton className="!text-xs" value={config.StatusOrders.CANCELED}>
                            {config.StatusOrders.CANCELED}
                        </ToggleButton>
                        <ToggleButton className="!text-xs" value={config.StatusOrders.WAITFORPAY}>
                            {config.StatusOrders.WAITFORPAY}
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <div className="space-y-5">
                        {listHistory.map((item, index) => (
                            <AnimationTran
                                tranY={100}
                                className=" bg-white rounded-lg shadow dark:bg-dark-600"
                                key={index}
                            >
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

                                <div className="flex flex-wrap gap-3 justify-between items-center p-5 bg-primary-50/40 rounded-b-lg dark:bg-dark-500">
                                    <div className="flex items-center gap-2 text-center">
                                        <span className="font-medium text">Thành tiền:</span>
                                        <div className="not-italic text-xl font-medium text-red-500  flex gap-1">
                                            {convertNumberToVND(item.total)}
                                            <span className="text-lg">đ</span>
                                        </div>
                                    </div>
                                    <div className="flex  gap-2">
                                        {item.status === config.StatusOrders.WAITFORPAY && (
                                            <Button
                                                className="!min-h-10 min-w-32"
                                                variant="fill"
                                                onClick={() => handlePaymentOrder(item.id)}
                                            >
                                                Thanh toán
                                            </Button>
                                        )}
                                        <Button
                                            className="!min-h-10 min-w-24"
                                            variant="outline"
                                            onClick={() => handleRedirectDetailOrder(item.id)}
                                        >
                                            Chi tiết
                                        </Button>
                                        {(item.status === config.StatusOrders.ORDERED ||
                                            item.status === config.StatusOrders.WAITFORPAY) && (
                                            <Button
                                                className="!min-h-10 min-w-28 text-red-500 hover:text-red-800"
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
                </section>
            )}
        </>
    );
};

export default PurchaseHistory;
