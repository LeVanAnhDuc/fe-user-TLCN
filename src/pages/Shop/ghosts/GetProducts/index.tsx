// libs
import { useEffect, useMemo } from 'react';
// types
import IProduct, { IProductFilter } from '@/interface/product';
// apis
import { getAllProductSearchWithinPagination } from '@/apis/productApi';

const GetProducts = ({
    setLoadingAPIGetProducts,
    page,
    searchItem,
    cateFilter,
    filterSortBy,
    setProducts,
    setTotalPages,
    setErrorAPI,
    setTotalProducts,
    setTotalProductsPage,
}: {
    setLoadingAPIGetProducts: React.Dispatch<React.SetStateAction<boolean>>;
    page: number;
    searchItem: string;
    cateFilter: string[];
    filterSortBy: string;
    setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setTotalProducts: React.Dispatch<React.SetStateAction<number>>;
    setTotalProductsPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const itemsPerPage = useMemo(() => 24, []);

    const getProducts = async () => {
        try {
            const resultcateFilterString = cateFilter.join(',');

            const productFilter: IProductFilter = {
                pageNo: page,
                pageSize: itemsPerPage,
                key: searchItem,
                cate: resultcateFilterString,
                sort: filterSortBy,
            };

            setLoadingAPIGetProducts(true);
            const response = await getAllProductSearchWithinPagination(productFilter);
            setLoadingAPIGetProducts(false);

            if (response.status === 200) {
                const { content, totalPages, totalElements, last, lastPageSize, pageSize } = response.data;
                if (last) {
                    setTotalProductsPage(lastPageSize);
                } else {
                    setTotalProductsPage(pageSize);
                }

                setProducts(content);
                setTotalPages(totalPages);
                setTotalProducts(totalElements);
            } else {
                setErrorAPI(true);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        getProducts();
    }, [page, searchItem, filterSortBy, cateFilter]);

    return null;
};

export default GetProducts;
