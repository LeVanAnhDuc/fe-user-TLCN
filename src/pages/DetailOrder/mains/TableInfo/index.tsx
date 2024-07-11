// libss
import { useTranslation } from 'react-i18next';
// types
import IOrder from '@/types/order';
// components
import AnimationTran from '@/components/AnimationTran';
// others
import { convertNumberToVND } from '@/utils/convertData';

const TableInfo = ({ order }: { order?: IOrder }) => {
    const { t } = useTranslation('purchaseHistory');

    return (
        <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="border bg-primary-100 p-4 text-lg dark:bg-dark-600" colSpan={2}>
                        {t('detailedOrderInformation')}
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-500">
                <tr>
                    <td className="border border-gray-300 p-3 min-w-40">{t('orderDate')}</td>
                    <td className="border border-gray-300 p-3 font-bold">
                        <AnimationTran tranY={-50}>{order?.createdDate}</AnimationTran>
                    </td>
                </tr>

                <tr>
                    <td className="border border-gray-300 p-3 min-w-40">{t('status')}</td>
                    <td className="border border-gray-300 p-3 font-bold text-red-500">
                        <AnimationTran tranY={-50} delay={0.02}>
                            {order?.status}
                        </AnimationTran>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-3 min-w-40">{t('shippingAddress')}</td>
                    <td className="border border-gray-300 p-3 font-bold">
                        <AnimationTran tranY={-50} delay={0.04}>
                            {order?.address.orderDetails}, {order?.address.ward}, {order?.address.district},{' '}
                            {order?.address.province}
                        </AnimationTran>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-3 min-w-40">{t('payments')}</td>
                    <td className="border border-gray-300 p-3 font-bold">
                        <AnimationTran tranY={-50} delay={0.06}>
                            {order?.paymentType}
                        </AnimationTran>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-3 min-w-40">{t('note')}</td>
                    <td className="border border-gray-300 p-3 font-bold">
                        <AnimationTran tranY={-50} delay={0.08}>
                            {order?.note}
                        </AnimationTran>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-3 min-w-40">{t('totalItem')}</td>
                    <td className="border border-gray-300 p-3 font-bold">
                        <AnimationTran tranY={-50} delay={0.1}>
                            {order?.totalItems}
                        </AnimationTran>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-3 min-w-40">{t('shippingFee')}</td>
                    <td className="border border-gray-300 p-3 font-bold">
                        <AnimationTran
                            tranY={-50}
                            delay={0.12}
                            className="text-base not-italic font-medium text-red-500 flex gap-1"
                        >
                            {convertNumberToVND(order?.shippingFee)}
                            <span className="text-sm pr-0.5">đ</span>
                        </AnimationTran>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-3 min-w-40">{t('subtotal')}</td>
                    <td className="border border-gray-300 p-3 font-bold">
                        <AnimationTran
                            tranY={-50}
                            delay={0.14}
                            className="text-base not-italic font-medium text-red-500 flex gap-1"
                        >
                            {convertNumberToVND(order?.total)}
                            <span className="text-sm pr-0.5">đ</span>
                        </AnimationTran>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default TableInfo;
