// libs
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
// types
import IOrder from '@/types/order';
import IProductCart from '@/types/productCart';
import { actionProduct } from '@/types/product';
// components
import Image from '@/components/Image';
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
import PopConfirm from '@/components/PopComfirm';
// apis
import { updateOrderStatusByID } from '@/apis/orderApi';
import { updateProductAnalysis } from '@/apis/productApi';
// ghosts
// others
import config from '@/config';
import { convertNumberToVND } from '@/utils/convertData';

const ViewOrder = ({
    orders,
    setBehaviorGetOrders,
    setErrorAPI,
    setItemReview,
    setOpenReview,
}: {
    orders: IOrder[];
    setBehaviorGetOrders: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setItemReview: React.Dispatch<React.SetStateAction<IProductCart>>;
    setOpenReview: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation('purchaseHistory');

    const handleRedirectDetailItem = async (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
            const actionClick: actionProduct = 'click';
            await updateProductAnalysis(idProduct, actionClick);
        }
    };

    const handleRedirectDetailOrder = (idOrder: number) => {
        if (idOrder) {
            navigate(`${config.Routes.detailOrder}/${idOrder}`);
        }
    };

    const handlePaymentOrder = async (idOder: number, orderItems: IProductCart[]) => {
        if (idOder) {
            navigate(config.Routes.checkOut, { state: { idOder: idOder, orderItems: orderItems } });
        }
    };

    const handleCancelOrder = async (idProduct: number) => {
        try {
            const response = await updateOrderStatusByID(idProduct, config.StatusOrders.CANCELED);

            if (response.status === 200) {
                setBehaviorGetOrders((prev) => !prev);
                toast.success(t('successDeletion'));
            } else {
                toast.error(t('errorDeletion'));
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    const handleOpenReview = (event: React.MouseEvent<HTMLButtonElement>, item: IProductCart) => {
        event.stopPropagation();
        setItemReview(item);
        setOpenReview(true);
    };

    return (
        <div className="space-y-5">
            {orders.map((item, index) => (
                <AnimationTran tranY={100} className=" bg-white rounded-lg shadow dark:bg-dark-600" key={index}>
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="text-sm font-bold">{item.createdDate}</div>
                        <div className="flex items-center gap-2">
                            {item.isPaidBefore && (
                                <div className="border-r-2 pr-2 text-sm font-medium text-green-500">
                                    {t('textSuccessPayVNPay')}
                                </div>
                            )}
                            <div
                                className={`
            ${item.status === config.StatusOrders.DELIVERED && '!text-green-500'}
            ${item.status === config.StatusOrders.CANCELED && '!text-red-600'} 
            uppercase font-semibold text-primary-700 text-base`}
                            >
                                {item.status}
                            </div>
                        </div>
                    </div>

                    <div
                        className="space-y-3 px-5 cursor-pointer select-none"
                        onClick={() => handleRedirectDetailOrder(item.id)}
                    >
                        {item.orderItems.map((itemProduct, indexProduct) => (
                            <Fragment key={indexProduct}>
                                <div className="h-0.5 bg-gray-200"></div>
                                <div className="size-full grid grid-cols-12 gap-1 overflow-hidden">
                                    <>
                                        <Image
                                            src={itemProduct.imageUrl}
                                            alt={'image' + itemProduct.product.name}
                                            className="col-span-3 md:col-span-2 object-cover object-center size-32 cursor-pointer rounded m-auto"
                                            onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                                                handleRedirectDetailItem(itemProduct.product.id);
                                                e.stopPropagation();
                                            }}
                                        />
                                        <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between gap-2 p-3 sm:p-4">
                                            <div className="line-clamp-2 font-medium">{itemProduct.product.name}</div>
                                            <div className="flex justify-between items-center flex-wrap gap-1">
                                                <div>
                                                    <div className="flex gap-2">
                                                        <span className="w-18">{t('classification')}:</span>
                                                        <span className="font-medium">
                                                            {itemProduct.sku?.optionValues?.map((option, index) => (
                                                                <React.Fragment key={index}>
                                                                    {option.valueName}
                                                                    {index < itemProduct.sku.optionValues.length - 1
                                                                        ? ' - '
                                                                        : ''}
                                                                </React.Fragment>
                                                            ))}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="w-18">{t('quantity')}:</span>
                                                        <span className="font-medium">{itemProduct.quantity}</span>
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
                                                            onClick={(e) => handleOpenReview(e, itemProduct)}
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
                            <span className="font-medium">{t('totalAmount')}:</span>
                            <div className="not-italic font-semibold text-red-500  flex gap-1">
                                {convertNumberToVND(item.total)} đ
                            </div>
                        </div>
                        <div className="flex  gap-2">
                            {item.status === config.StatusOrders.WAITFORPAY && (
                                <Button
                                    className="!h-9 text-sm !rounded-md whitespace-nowrap"
                                    variant="fill"
                                    onClick={() => handlePaymentOrder(item.id, item.orderItems)}
                                >
                                    {t('payment')}
                                </Button>
                            )}
                            <Button
                                className="!h-9 text-sm !rounded-md whitespace-nowrap"
                                variant="outline"
                                onClick={() => handleRedirectDetailOrder(item.id)}
                            >
                                {t('detail')}
                            </Button>
                            {(item.status === config.StatusOrders.ORDERED ||
                                item.status === config.StatusOrders.WAITFORPAY) && (
                                <PopConfirm
                                    title={t('popConfirmDeleteTitle')}
                                    content={t('popConfirmDeleteContent')}
                                    onConfirm={() => handleCancelOrder(item.id)}
                                    onCancel={() => toast.info(t('cancelDeletion'))}
                                >
                                    <Button
                                        className="!h-9 text-sm !rounded-md whitespace-nowrap text-red-500 hover:text-red-800"
                                        variant="text"
                                    >
                                        {t('cancelOrder')}
                                    </Button>
                                </PopConfirm>
                            )}
                        </div>
                    </div>
                </AnimationTran>
            ))}
        </div>
    );
};

export default ViewOrder;
