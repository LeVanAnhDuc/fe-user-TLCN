// libs
import { useEffect, useMemo } from 'react';
// types
import IOrder from '@/types/order';
// apis
import { searchOrderForUser } from '@/apis/orderApi';
// hooks
import useDebounceCustom from '@/hook/useDebounceCustom';

const GetPurchaseHistory = ({
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
}: {
    firstLoadingAPI: boolean;
    setLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    statusOrder: string;
    page: number;
    setFirstLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    search: string;
    behaviorGetOrders: boolean;
}) => {
    const itemsPerPage = useMemo(() => 5, []);

    const handleGetListHistory = async (searchParam: string) => {
        try {
            firstLoadingAPI && setLoadingAPI(true);

            const [response] = await Promise.all([
                searchOrderForUser(statusOrder, searchParam, page, itemsPerPage),
                firstLoadingAPI && new Promise((resolve) => setTimeout(resolve, 250)),
            ]);

            firstLoadingAPI && setLoadingAPI(false);

            if (response?.status === 200) {
                setFirstLoadingAPI(false);
                setOrders(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                setErrorAPI(true);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    const searchDebounce = useDebounceCustom(search, 300);

    useEffect(() => {
        handleGetListHistory(searchDebounce);
    }, [statusOrder, behaviorGetOrders, searchDebounce, page]);
    return null;
};

export default GetPurchaseHistory;
