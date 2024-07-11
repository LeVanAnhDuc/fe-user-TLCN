// libss
import { useTranslation } from 'react-i18next';
// types
import IOrder from '@/types/order';
// components
import AnimationTran from '@/components/AnimationTran';
import CodIcon from '@/components/icons/CodIcon';
import VnpayIcon from '@/components/icons/VnpayIcon';

// others
import { convertNumberToVND } from '@/utils/convertData';

// const TableInfo = ({ order }: { order?: IOrder }) => {
//     const { t } = useTranslation('purchaseHistory');

//     return (
//         <table className="w-full border-collapse border border-gray-300">
//             <thead>
//                 <tr>
//                     <th className="border bg-primary-100 p-4 text-lg dark:bg-dark-600" colSpan={2}>
//                         {t('detailedOrderInformation')}
//                     </th>
//                 </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-dark-500">
//                 <tr>
//                     <td className="border border-gray-300 p-3 min-w-40">{t('orderDate')}</td>
//                     <td className="border border-gray-300 p-3 font-bold">
//                         <AnimationTran tranY={-50}>{order?.createdDate}</AnimationTran>
//                     </td>
//                 </tr>

//                 <tr>
//                     <td className="border border-gray-300 p-3 min-w-40">{t('status')}</td>
//                     <td className="border border-gray-300 p-3 font-bold text-red-500">
//                         <AnimationTran tranY={-50} delay={0.02}>
//                             {order?.status}
//                         </AnimationTran>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="border border-gray-300 p-3 min-w-40">{t('shippingAddress')}</td>
//                     <td className="border border-gray-300 p-3 font-bold">
//                         <AnimationTran tranY={-50} delay={0.04}>
//                             {order?.address.orderDetails}, {order?.address.ward}, {order?.address.district},{' '}
//                             {order?.address.province}
//                         </AnimationTran>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="border border-gray-300 p-3 min-w-40">{t('payments')}</td>
//                     <td className="border border-gray-300 p-3 font-bold">
//                         <AnimationTran tranY={-50} delay={0.06}>
//                             {order?.paymentType}
//                         </AnimationTran>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="border border-gray-300 p-3 min-w-40">{t('note')}</td>
//                     <td className="border border-gray-300 p-3 font-bold">
//                         <AnimationTran tranY={-50} delay={0.08}>
//                             {order?.note}
//                         </AnimationTran>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="border border-gray-300 p-3 min-w-40">{t('totalItem')}</td>
//                     <td className="border border-gray-300 p-3 font-bold">
//                         <AnimationTran tranY={-50} delay={0.1}>
//                             {order?.totalItems}
//                         </AnimationTran>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="border border-gray-300 p-3 min-w-40">{t('shippingFee')}</td>
//                     <td className="border border-gray-300 p-3 font-bold">
//                         <AnimationTran
//                             tranY={-50}
//                             delay={0.12}
//                             className="text-base not-italic font-medium text-red-500 flex gap-1"
//                         >
//                             {convertNumberToVND(order?.shippingFee)}
//                             <span className="text-sm pr-0.5">đ</span>
//                         </AnimationTran>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="border border-gray-300 p-3 min-w-40">{t('subtotal')}</td>
//                     <td className="border border-gray-300 p-3 font-bold">
//                         <AnimationTran
//                             tranY={-50}
//                             delay={0.14}
//                             className="text-base not-italic font-medium text-red-500 flex gap-1"
//                         >
//                             {convertNumberToVND(order?.total)}
//                             <span className="text-sm pr-0.5">đ</span>
//                         </AnimationTran>
//                     </td>
//                 </tr>
//             </tbody>
//         </table>
//     );
// };


const TableInfo = ({ order }: { order?: IOrder }) => {
    const { t } = useTranslation('purchaseHistory');

    const paymentIcon = order?.paymentType === 'Thanh toán khi nhận hàng'
        ? <CodIcon/> 
        : <VnpayIcon/>;

        return (
            <div className="max-w-4xl mx-auto bg-[#ffffff] rounded-lg mt-8">
                <div className="bg-gray-200 p-6 border-b">
                    <h2 className="text-2xl font-semibold text-gray-700">{t('detailedOrderInformation')}</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">{t('orderDate')}</h3>
                        <p className="text-gray-700">{order?.createdDate}</p>
                    </div>
                    <div >
                        <h3 className="text-lg font-medium text-gray-900">{t('shippingAddress')}</h3>
                        <p className="text-gray-700">{order?.address.fullName}</p>
                        <p className="text-gray-700">{order?.address.phoneNumber}</p>
                        <p className="text-gray-700">{order?.address.orderDetails}, {order?.address.ward}, {order?.address.district}, {order?.address.province}</p>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-xxl font-medium text-gray-900">{t('totalItem')}</h3>
                        <p className="text-gray-700 text-lg pl-10">{order?.totalItems}</p>
                    </div>
                  
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900">{t('note')}</h3>
                        <p className="text-gray-700">{order?.note || 'N/A'}</p>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900">{t('payments')}</h3>
                        <p className="text-gray-700 flex items-center">
                            <span className="ml-2">{order?.paymentType}</span>
                            {paymentIcon}
                        </p>
                    </div>

                    <div className="col-span-2 mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Tổng tiền hàng</h3>
                            <p className="text-gray-700">{convertNumberToVND(order?.subTotal)} đ</p>
                        </div>
                        <div>
                            <h3 className="text-md font-medium text-gray-900">Phí vận chuyển</h3>
                            <p className="text-gray-700">{convertNumberToVND(order?.shippingFee)} đ</p>
                        </div>
                        <div>
                            <h3 className="text-md font-medium text-gray-900">Giảm giá phí vận chuyển</h3>
                            <p className="text-gray-700">0 đ</p>
                        </div>
                        <div className="text-red-500 font-bold">
                            <h3 className="text-lg font-medium text-gray-900">Thành tiền</h3>
                            <p className='text-2xl'>{convertNumberToVND(order?.total)} đ</p>
                        </div>
                    </div>
                </div>
    
                
            </div>
        );
    };

export default TableInfo;
