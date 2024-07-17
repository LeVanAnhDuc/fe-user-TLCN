// libss
import { useParams } from 'react-router-dom';
import { useState } from 'react';
// types
import IProductCart from '@/types/productCart';
import IOrder from '@/types/order';
// components
import ScrollButton from '@/components/ScrollButton/ScrollButton';
import Loading from '@/components/Loading';
import Error404 from '../Error404';
import ModalReview from '../Profile/PurchaseHistory/mains/ModalReview';
import BreadcrumbsAction from './mains/BreadcrumbsAction';
import TableInfo from './mains/TableInfo';
import OrdersDetail from './mains/OrdersDetail';
import ActionOrder from './mains/ActionOrder';


// ghosts
import GetOrder from './ghosts/GetOrder';
// others
import { initObjectProductCart } from '@/constants';

import React from 'react';

interface OrderProgressBarProps {
    status: string;
}


const OrderTrackingTimeline = ({ trackingDTOs }) => {
    const sortedEvents = [...trackingDTOs].sort((a, b) =>
        new Date(b.time.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')) -
        new Date(a.time.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'))
    );

    return (
        <div className="my-10 ml-8 pb-8">
            {/* <h3 className="text-lg font-semibold mb-4">Lịch sử trạng thái đơn hàng</h3> */}
            <div className="space-y-4">
                {sortedEvents.map((event, index) => (
                    <div key={event.id} className="flex">
                        <div className="w-1/4 text-right pr-4 text-sm font-medium text-gray-500">
                            {event.time}
                        </div>
                        <div className="w-3/4 relative pl-8">
                            <div className="absolute left-0 top-1.5 -ml-px h-full w-0.5 bg-gray-300" aria-hidden="true"></div>
                            <div className="relative flex items-start">
                                <span className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-white">
                                    <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                                </span>
                                <span className="ml-4 text-sm text-gray-700">{event.description}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const OrderProgressBar: React.FC<OrderProgressBarProps> = ({ status }) => {
    const allSteps = [
        { title: 'Đã đặt hàng', icon: '📦' },
        { title: 'Chờ thanh toán', icon: '💳' },
        { title: 'Đang xử lý', icon: '🔧' },
        { title: 'Đang giao', icon: '🚚' },
        { title: 'Đã giao', icon: '✅' },
        { title: 'Đã hủy', icon: '❌' }
    ];

    const getSteps = () => {
        switch (status) {
            case 'Chờ thanh toán':
                return allSteps.filter(step => ['Đã đặt hàng', 'Chờ thanh toán', 'Đang xử lý', 'Đang giao', 'Đã giao'].includes(step.title));
            case 'Đã hủy':
                return allSteps.filter(step => ['Đã đặt hàng', 'Đã hủy'].includes(step.title));
            default:
                return allSteps.filter(step => !['Chờ thanh toán', 'Đã hủy'].includes(step.title));
        }
    };

    const steps = getSteps();
    const currentStepIndex = steps.findIndex(step => step.title === status);

    return (
        <div className="w-full py-6 px-4">
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="relative flex flex-col items-center flex-1">
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-xl
                ${index <= currentStepIndex
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-white border-gray-300 text-gray-500'}
                ${step.title === 'Đã hủy' ? 'bg-red-500 border-red-500 text-white' : ''}`}>
                                {step.icon}
                            </div>
                            <div className={`mt-2 text-xs text-center md:text-sm font-medium
                ${index <= currentStepIndex ? 'text-green-500' : 'text-gray-500'}
                ${step.title === 'Đã hủy' ? 'text-red-500' : ''}`}>
                                {step.title}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`absolute top-6 left-1/2 w-full h-1 transition-all duration-500 ease-in-out
                  ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}
                  ${status === 'Đã hủy' ? 'bg-red-500' : ''}`} />
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const DetailOrder = () => {
    const { id } = useParams();
    const idProduct = id;

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [order, setOrder] = useState<IOrder>();
    const [openReview, setOpenReview] = useState(false);
    const [itemReview, setItemReview] = useState<IProductCart>(initObjectProductCart);
    const [behaviorGetOrders, setBehaviorGetOrders] = useState<boolean>(false);

    const handleCloseReview = () => setOpenReview(false);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetOrder
                {...{
                    idProduct,
                    firstLoadingAPI,
                    setLoadingAPI,
                    setFirstLoadingAPI,
                    setOrder,
                    setErrorAPI,
                    behaviorGetOrders,
                }}
            />

            <ModalReview
                open={openReview}
                handleClose={handleCloseReview}
                orderItem={itemReview}
                setBehaviorGetOrders={setBehaviorGetOrders}
            />

            {isLoadingAPI ? (
                <div className=" flex justify-center items-center min-h-[80vh]">
                    <Loading />
                </div>
            ) : (
                <section className="bg-gray-100 py-10 dark:bg-dark-400">
                    <ScrollButton />
                    <div className="w-10/12 m-auto space-y-5">
                        <BreadcrumbsAction idProduct={idProduct} />

                        {order && <OrderProgressBar status={order.status} />}
                        {order && order.trackingDTOs && <OrderTrackingTimeline trackingDTOs={order.trackingDTOs} />}

                        <TableInfo order={order} />

                        <OrdersDetail {...{ order, setItemReview, setOpenReview }} />

                        <ActionOrder {...{ setBehaviorGetOrders, setErrorAPI, order }} />
                    </div>
                </section>
            )}
        </>
    );
};

export default DetailOrder;
