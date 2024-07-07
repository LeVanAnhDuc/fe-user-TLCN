// libs
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// types
import ICategory from '@/types/category';
import IProduct from '@/types/product';
// components
import Card from '@/components/Card';
import ScrollButton from '@/components/ScrollButton/ScrollButton';
import Pagination from '@/components/Pagination';
import Error404 from '../Error404';
import FilterProduct from './mains/FilterProduct';
import DrawerFilterProduct from './mains/DrawerFilterProduct';
// ghosts
import GetCategories from './ghosts/GetCategories';
import GetProducts from './ghosts/GetProducts';
// other
import config from '@/config';
import { initObjectProduct } from '@/constants';

function Listproducts() {
    const location = useLocation();
    const { t } = useTranslation('shop');

    const itemsPerPage = 24;
    const searchItem = location.state?.searchItem ? location.state.searchItem : '';

    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [loadingAPIGetProducts, setLoadingAPIGetProducts] = useState<boolean>(false);
    const [loadingAPIGetCategories, setLoadingAPIGetCategories] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalProductsPage, setTotalProductsPage] = useState<number>(0);
    const [filterSortBy, setFilterSortBy] = useState<string>(config.SearchFilter.random);
    const [cateFilter, setCateFilter] = useState<Array<string>>(
        location.state?.category ? [location.state.category as string] : [],
    );
    const [categories, setCategories] = useState<Array<ICategory>>([]);
    const [openMenuFilterResponsive, setOpenMenuFilterResponsive] = useState(false);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetCategories {...{ setLoadingAPIGetCategories, setCategories, setErrorAPI }} />
            <GetProducts
                {...{
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
                }}
            />

            <section className="bg-gray-100 dark:bg-dark-400">
                <div className="sm:w-10/12 w-11/12 py-6 mx-auto relative">
                    <ScrollButton />

                    <div className="grid xl:grid-cols-12 gap-10 relative">
                        <div className="col-span-3 w-full h-[87vh] hidden xl:block sticky top-20 rounded z-40">
                            <div className=" w-full h-full pr-0.5 overflow-y-auto space-y-3">
                                <FilterProduct
                                    {...{
                                        filterSortBy,
                                        setFilterSortBy,
                                        loadingAPIGetCategories,
                                        categories,
                                        cateFilter,
                                        setCateFilter,
                                        setPage,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 xl:col-span-9 min-h-[87vh] flex flex-col">
                            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 ">
                                {loadingAPIGetProducts
                                    ? Array(itemsPerPage)
                                          .fill(initObjectProduct)
                                          .map((item, index) => (
                                              <Card
                                                  key={index}
                                                  itemProduct={item}
                                                  loading={loadingAPIGetProducts}
                                                  delay={(index % 3) / 5}
                                              />
                                          ))
                                    : products.map((item, index) => (
                                          <Card
                                              key={index}
                                              itemProduct={item}
                                              loading={loadingAPIGetProducts}
                                              delay={(index % 3) / 5}
                                          />
                                      ))}
                            </div>
                            {!loadingAPIGetProducts && products.length === 0 && (
                                <div className="size-full flex flex-col items-center justify-center text-xl text-gray-400 gap-5 ">
                                    <ContentPasteSearch sx={{ fontSize: '100px' }} />
                                    {t('noProducts')}
                                </div>
                            )}
                            <div className="w-full flex justify-between items-center py-5 mt-auto">
                                <article>
                                    {t('showing')} <span className="font-bold">{totalProductsPage} </span>
                                    {t('of')} <span className="font-bold">{totalProducts}</span> {t('results')}
                                </article>
                                <Pagination {...{ totalPages, page, setPage }} />
                            </div>
                        </div>
                    </div>

                    <DrawerFilterProduct
                        {...{
                            filterSortBy,
                            setFilterSortBy,
                            loadingAPIGetCategories,
                            categories,
                            cateFilter,
                            setCateFilter,
                            setPage,
                            openMenuFilterResponsive,
                            setOpenMenuFilterResponsive,
                        }}
                    />
                </div>
            </section>
        </>
    );
}

export default Listproducts;
