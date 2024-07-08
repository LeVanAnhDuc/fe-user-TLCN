// libs
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// types
import IOrder from '@/types/order';
import IProductCart from '@/types/productCart';
// components
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import Error404 from '../../Error404';
import ModalReview from './mains/ModalReview';
import FilterOrder from './mains/FilterOrder';
import ViewOrder from './mains/ViewOrder';
// ghosts
import GetPurchaseHistory from './ghosts/GetPurchaseHistory';
// others
import { initObjecProductCart } from '@/constants';

const PurchaseHistory = () => {
    const location = useLocation();

    const status = location.state?.status ? location.state.status : '';

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [orders, setOrders] = useState<Array<IOrder>>([]);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [statusOrder, setStatusOrder] = useState<string>(status);
    const [openReview, setOpenReview] = useState(false);
    const [itemReview, setItemReview] = useState<IProductCart>(initObjecProductCart);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [behaviorGetOrders, setBehaviorGetOrders] = useState<boolean>(false);

    const handleCloseReview = () => setOpenReview(false);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetPurchaseHistory
                {...{
                    firstLoadingAPI,
                    setLoadingAPI,
                    statusOrder,
                    page,
                    setFirstLoadingAPI,
                    setOrders,
                    setTotalPages,
                    setErrorAPI,
                    search,
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
                <Loading />
            ) : (
                <section className="space-y-4">
                    <FilterOrder
                        {...{
                            setStatusOrder,
                            setPage,
                            statusOrder,
                            search,
                            setSearch,
                        }}
                    />

                    <ViewOrder
                        {...{
                            orders,
                            setBehaviorGetOrders,
                            setErrorAPI,
                            setItemReview,
                            setOpenReview,
                        }}
                    />

                    <div className="flex justify-end">
                        <Pagination {...{ totalPages, page, setPage }} />
                    </div>
                </section>
            )}
        </>
    );
};

export default PurchaseHistory;
