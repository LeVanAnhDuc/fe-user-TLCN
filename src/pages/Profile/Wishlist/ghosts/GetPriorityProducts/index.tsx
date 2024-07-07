// libs
import { useEffect, useMemo } from 'react';
// types
import IFollowProduct from '@/interface/followProduct';
// apis
import { getWishListWithPagination } from '@/apis/followProductApi';

const GetPriorityProducts = ({
    page,
    firstLoadingAPI,
    setLoadingAPI,
    setFirstLoadingAPI,
    SetPriorityProducts,
    setTotalPages,
    setErrorAPI,
    behaviorGetPriorityProducts,
}: {
    page: number;
    firstLoadingAPI: boolean;
    setLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setFirstLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    SetPriorityProducts: React.Dispatch<React.SetStateAction<IFollowProduct[]>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    behaviorGetPriorityProducts: boolean;
}) => {
    const itemsPerPage = useMemo(() => 20, []);

    const getAllFollowProduct = async () => {
        try {
            firstLoadingAPI && setLoadingAPI(true);

            const [response] = await Promise.all([
                getWishListWithPagination(page, itemsPerPage),
                firstLoadingAPI && new Promise((resolve) => setTimeout(resolve, 250)),
            ]);

            firstLoadingAPI && setLoadingAPI(false);

            if (response?.status === 200) {
                setFirstLoadingAPI(false);
                const { content, totalPages } = response.data;

                SetPriorityProducts(content);
                setTotalPages(totalPages);
            } else {
                setErrorAPI(true);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        getAllFollowProduct();
    }, [page, behaviorGetPriorityProducts]);

    return null;
};

export default GetPriorityProducts;
