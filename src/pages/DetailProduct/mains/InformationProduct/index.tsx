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
                <div className="flex gap-2 font-medium">
                    <div className="space-x-1 text-red-500">
                        <span>{convertNumberToVND(product?.price)}</span>
                        <span className="text-sm">đ</span>
                    </div>
                    {product?.percentDiscount !== 0 && (
                        <div className="space-x-1 text-gray-400 line-through">
                            <span>{convertNumberToVND(product?.originalPrice)}</span>
                            <span className="text-sm">đ</span>
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
