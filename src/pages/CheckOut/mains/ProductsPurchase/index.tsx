// libs
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// types
import IProductCart from '@/types/productCart';
import { actionProduct } from '@/types/product';
// components
import AnimationTran from '@/components/AnimationTran';
import Image from '@/components/Image';
// apis
import { updateProductAnalysis } from '@/apis/productApi';
// redux
import { selectProductsPurchaseCart } from '@/pages/Cart/cartSlice';
// others
import config from '@/config';
import { convertNumberToVND } from '@/utils/convertData';

const ProductsPurchase = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('checkOut');
    const productsPurchase: IProductCart[] = useSelector(selectProductsPurchaseCart);

    const handleRedirectDetailItem = async (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
            const actionClick: actionProduct = 'click';
            await updateProductAnalysis(idProduct, actionClick);
        }
    };

    return (
        <div className="space-y-3 bg-white p-10 rounded-lg dark:bg-dark-600">
            {productsPurchase.map((item: IProductCart, index: number) => (
                <div className="flex items-center" key={item.id}>
                    <AnimationTran
                        tranY={100}
                        key={item.id}
                        className="size-full grid grid-cols-12 gap-2 bg-gray-100 rounded-lg overflow-hidden shadow dark:bg-dark-500"
                        delay={(index % 4) / 20}
                    >
                        <>
                            <Image
                                src={item.imageUrl}
                                alt={'image' + item.product.name}
                                className="col-span-3 md:col-span-2 aspect-square object-cover py-3 pl-3 object-center cursor-pointer size-32 m-auto"
                                onClick={() => {
                                    handleRedirectDetailItem(item.product.id);
                                }}
                            />
                            <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between p-2">
                                <div className="line-clamp-2 font-normal mb-3 h-5">{item.product.name}</div>
                                <div className="flex justify-between items-center flex-wrap gap-1">
                                    <aside>
                                        <div className="flex gap-1">
                                            <span className="font-normal w-18">{t('classification')}:</span>
                                            <span className="font-medium">
                                                {item.sku?.optionValues?.map((option, index) => (
                                                    <React.Fragment key={index}>
                                                        {option.valueName}
                                                        {index < item.sku.optionValues.length - 1 ? ' - ' : ''}
                                                    </React.Fragment>
                                                ))}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="font-normal w-18">{t('unitPrice')}: </span>
                                            <span className="not-italic font-medium text-red-500 flex gap-1">
                                                {convertNumberToVND(item.price)}
                                                <span className="text-xs"> đ</span>
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="font-normal w-18">{t('quantity')}:</span>
                                            <div className="font-medium">{convertNumberToVND(item.quantity)}</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="font-medium w-18">{t('totalPrice')}:</span>
                                            <div className="not-italic font-medium text-red-500 flex gap-1">
                                                {convertNumberToVND(item.subTotal)}
                                                <span className="text-xs">đ</span>
                                            </div>
                                        </div>
                                    </aside>
                                </div>
                            </div>
                        </>
                    </AnimationTran>
                </div>
            ))}
        </div>
    );
};

export default ProductsPurchase;
