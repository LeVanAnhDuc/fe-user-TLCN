// libs
import { useTranslation } from 'react-i18next';
// components
import AnimationScale from '@/components/AnimationScale';
// others
import { convertNumberToVND } from '@/utils/convertData';

const PriceTotal = ({ totalPrice, feePrice }: { totalPrice: number; feePrice: number }) => {
    const { t } = useTranslation('checkOut');

    return (
        <>
            <h1 className="text-xl font-bold text-center">{t('totalCost')}</h1>
            <div className="flex justify-between">
                <span className="font-medium">{t('totalAmount')}</span>
                <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                    {convertNumberToVND(totalPrice)}
                    <span className="text-sm">đ</span>
                </AnimationScale>
            </div>
            <div className="flex justify-between">
                <span className="font-medium">
                    {t('totalDelivery')} ({t('standard')})
                </span>
                <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                    {convertNumberToVND(feePrice)}
                    <span className="text-sm">đ</span>
                </AnimationScale>
            </div>
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="flex justify-between relative">
                <span className="font-medium">{t('subtotal')}</span>
                <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                    {convertNumberToVND(totalPrice + feePrice)}
                    <span className="text-sm">đ</span>
                </AnimationScale>
            </div>
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="text-center text-gray-600 dark:text-gray-300">({t('TotalPriceOfYourOrder')})</div>
        </>
    );
};

export default PriceTotal;
