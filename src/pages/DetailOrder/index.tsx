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
