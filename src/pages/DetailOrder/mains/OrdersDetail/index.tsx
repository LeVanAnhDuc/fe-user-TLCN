// libss
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
// types
import IProductCart from '@/types/productCart';
import { actionProduct } from '@/types/product';
import IOrder from '@/types/order';
// components
import Image from '@/components/Image';
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
// apis
import { updateProductAnalysis } from '@/apis/productApi';
// others
import config from '@/config';
import { convertNumberToVND } from '@/utils/convertData';

const OrdersDetail = ({
    order,
    setItemReview,
    setOpenReview,
}: {
    order?: IOrder;
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

    const handleOpenReview = (item: IProductCart) => {
        setItemReview(item);
        setOpenReview(true);
    };

    return (
        <div className="space-y-5">
            {order?.orderItems.map((itemProduct, indexProduct) => (
                <Fragment key={indexProduct}>
                    <AnimationTran
                        tranY={100}
                        className="size-full grid grid-cols-12 gap-1 overflow-hidden bg-white rounded-lg shadow dark:bg-dark-600"
                    >
                        <>
                            <Image
                                src={itemProduct.imageUrl}
                                alt={'image' + itemProduct.product.name}
                                className="col-span-3 md:col-span-2 object-cover object-center size-full cursor-pointer rounded max-h-40"
                                onClick={() => handleRedirectDetailItem(itemProduct.product.id)}
                            />
                            <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between gap-2 p-3 sm:p-4">
                                <div className="line-clamp-2 font-medium">{itemProduct.product.name}</div>
                                <div className="flex justify-between items-center flex-wrap gap-1">
                                    <div>
                                        <div className="flex gap-2">
                                            <span className="w-18">{t('classification')}:</span>
                                            <span className="font-medium">
                                                {itemProduct.sku?.optionValues?.map((option, index) => (
                                                    <Fragment key={index}>
                                                        {option.valueName}
                                                        {index < itemProduct.sku.optionValues.length - 1 ? ' - ' : ''}
                                                    </Fragment>
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
                                                onClick={() => handleOpenReview(itemProduct)}
                                            >
                                                {t('writeAReview')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    </AnimationTran>
                </Fragment>
            ))}
        </div>
    );
};

export default OrdersDetail;
