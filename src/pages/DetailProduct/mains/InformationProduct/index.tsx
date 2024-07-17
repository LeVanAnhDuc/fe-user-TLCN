// libs
import Rating from '@mui/material/Rating';
import { useTranslation } from 'react-i18next';
// types
import IProduct from '@/types/product';
// others
import { convertNumberToVND } from '@/utils/convertData';

const InformationProduct = ({ product, ratingProduct }: { product?: IProduct; ratingProduct: number }) => {
    const { t } = useTranslation('detailProduct');

    return (
        <>
            <div className="xl:text-lg font-medium">{product?.name}</div>
            <div className="flex flex-wrap items-center justify-between text-sm gap-1 xl:text-base">
                <div className="flex items-center gap-2 font-medium">
                    {product?.percentDiscount !== 0 && (
                        <div className="space-x-1 text-sm text-gray-400 line-through ">
                            <span>{convertNumberToVND(product?.originalPrice)}</span>
                            <span className="text-xs">đ</span>
                        </div>
                    )}
                    <div className="space-x-1 text-red-500 text-2xl">
                        <span>{convertNumberToVND(product?.price)}</span>
                        <span className="text-xl">đ</span>
                    </div>
                    {product?.percentDiscount !== 0 && (
                        <div className="bg-primary-700 text-white text-sm flex items-center gap-1 px-1 py-0.5 rounded">
                            {product?.percentDiscount}% <span className="uppercase">{t('of')}</span>
                        </div>
                    )}
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1">
                    <span className="font-semibold">{product?.rating}/5</span>
                    <Rating readOnly value={ratingProduct} precision={0.1} size="small" />
                </div>
                <span className="text-gray-400 px-3">|</span>
                <div className="flex items-center gap-1">
                    <span className="font-semibold">{product?.numberOfRatings}</span>
                    <span>{t('review')}</span>
                </div>
            </div>
        </>
    );
};

export default InformationProduct;
