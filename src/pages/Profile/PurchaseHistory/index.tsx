import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

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
import Search from '../../../components/Search';
import useDebounceCustom from '../../../hook/useDebounceCustom';

const PurchaseHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation('purchaseHistory');

    const status = location.state?.status ? location.state.status : '';

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [listHistory, setListHistory] = useState<Array<IOrder>>([]);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [callAPIAgain, setCallAPIAgain] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [statusOrder, setStatusOrder] = useState<string>(status);
    const [openReview, setOpenReview] = useState(false);
    const [itemReview, setItemReview] = useState<IProductCart>(initObjecProductCart);
    const [search, setSearch] = useState<string>('');

    const handleChangeStatus = (_: React.MouseEvent<HTMLElement>, status: string) => {
        setStatusOrder(status);
    };

    const handleGetListHistory = async (statusParam: string, searchParam: string) => {
        try {
            firstLoadingAPI && setLoadingAPI(true);

            const [response] = await Promise.all([
                searchOrderForUser(statusParam, searchParam),
                firstLoadingAPI && new Promise((resolve) => setTimeout(resolve, 250)),
            ]);

            firstLoadingAPI && setLoadingAPI(false);

            if (response?.status === 200) {
                setFirstLoadingAPI(false);
                setListHistory(response.data.content);
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
        const userConfirmed = window.confirm(t('userConfirmed'));
        if (userConfirmed) {
            try {
                const response = await updateOrderStatusByID(idProduct, config.StatusOrders.CANCELED);

                if (response.status === 200) {
                    handleGetListHistory(statusOrder, search);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                setErrorAPI(true);
            }
        } else {
            toast.info(t('cancelDeletion'));
        }
    };

    const handleOpenReview = (item: IProductCart) => {
        setItemReview(item);
        setOpenReview(true);
    };
    const handleCloseReview = () => setOpenReview(false);

    const searchDebounce = useDebounceCustom(search, 300);

    useEffect(() => {
        handleGetListHistory(statusOrder, searchDebounce);
    }, [statusOrder, callAPIAgain, searchDebounce]);

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
                    <div className="space-y-2 p-2 rounded bg-white dark:bg-dark-300">
                        <ToggleButtonGroup
                            value={statusOrder}
                            exclusive
                            onChange={handleChangeStatus}
                            fullWidth
                            className="!bg-white dark:!bg-dark-600 min-h-12"
                            color="info"
                        >
                            <ToggleButton className="!text-xs sm:!text-sm !capitalize" value={''}>
                                {t('all')}
                            </ToggleButton>
                            <ToggleButton
                                className="!text-xs sm:!text-sm !capitalize"
                                value={config.StatusOrders.ORDERED}
                            >
                                {t('ordered')}
                            </ToggleButton>
                            <ToggleButton
                                className="!text-xs sm:!text-sm !capitalize"
                                value={config.StatusOrders.PROCESSING}
                            >
                                {t('processing')}
                            </ToggleButton>
                            <ToggleButton
                                className="!text-xs sm:!text-sm !capitalize"
                                value={config.StatusOrders.SHIPPED}
                            >
                                {t('shipped')}
                            </ToggleButton>
                            <ToggleButton
                                className="!text-xs sm:!text-sm !capitalize"
                                value={config.StatusOrders.DELIVERED}
                            >
                                {t('delivered')}
                            </ToggleButton>
                            <ToggleButton
                                className="!text-xs sm:!text-sm !capitalize"
                                value={config.StatusOrders.CANCELED}
                            >
                                {t('canceled')}
                            </ToggleButton>
                            <ToggleButton
                                className="!text-xs sm:!text-sm !capitalize"
                                value={config.StatusOrders.WAITFORPAY}
                            >
                                {t('waitForPay')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Search search={search} setSearch={setSearch} placeholderSearch={t('searchTitle')} />
                    </div>

                    <div className="space-y-5">
                        {listHistory.map((item, index) => (
                            <AnimationTran
                                tranY={100}
                                className=" bg-white rounded-lg shadow dark:bg-dark-600"
                                key={index}
                            >
                                <div className="flex items-center justify-between p-5">
                                    <div className="text-sm font-bold">{item.createdDate}</div>
                                    <div className="flex items-center gap-2">
                                        {item.isPaidBefore ? (
                                            <div className="border-r-2 pr-2 text-sm font-medium text-green-500">
                                                Đơn hàng đã được thanh toán
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <div
                                            className={`
                                ${item.status === config.StatusOrders.DELIVERED && '!text-green-500'}
                                ${item.status === config.StatusOrders.CANCELED && '!text-red-600'} 
                                uppercase font-bold text-primary-700 text-lg`}
                                        >
                                            {item.status}
                                        </div>
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
                                                                    <span className="w-18">{t('classification')}:</span>
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
                                                                    <span className="w-18">{t('quantity')}:</span>
                                                                    <span className="font-medium">
                                                                        {itemProduct.quantity}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span className="w-18">{t('unitPrice')}: </span>
                                                                    <span className="not-italic font-bold text-red-500 flex gap-1">
                                                                        {convertNumberToVND(itemProduct.price)}
                                                                        <span className="text-xs"> đ</span>
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span className="w-18">{t('totalPrice')}:</span>
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
                                                                        {t('writeAReview')}
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
                                        <span className="font-medium text">{t('totalAmount')}:</span>
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
                                                {t('payment')}
                                            </Button>
                                        )}
                                        <Button
                                            className="!min-h-10 min-w-24"
                                            variant="outline"
                                            onClick={() => handleRedirectDetailOrder(item.id)}
                                        >
                                            {t('detail')}
                                        </Button>
                                        {(item.status === config.StatusOrders.ORDERED ||
                                            item.status === config.StatusOrders.WAITFORPAY) && (
                                            <Button
                                                className="!min-h-10 min-w-28 text-red-500 hover:text-red-800"
                                                variant="text"
                                                onClick={() => handleCancelOrder(item.id)}
                                            >
                                                {t('cancelOrder')}
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
