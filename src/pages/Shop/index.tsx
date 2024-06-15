// libs
import Pagination from '@mui/material/Pagination';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';
import Close from '@mui/icons-material/Close';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// types
import ICategory from '../../interface/category';
import IProduct, { IProductFilter } from '../../interface/product';
// components
import Card from '../../components/Card';
import ScrollButton from '../../components/ScrollButton/ScrollButton';
import Button from '../../components/Button';
import Skeleton from '../../components/Skeleton';
import Error404 from '../Error404';
// apis
import { getAllCategoryWithPagination } from '../../apis/categoryApii';
import { getAllProductSearchWithinPagination } from '../../apis/productApi';
// other
import config from '../../config';
import * as constants from '../../constants';

function Listproducts() {
    const location = useLocation();
    const { t } = useTranslation('shop');

    const itemsPerPage = 24;
    const searchItem = location.state?.searchItem ? location.state.searchItem : '';

    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [isLoadingAPIProducts, setIsLoadingAPIProduct] = useState<boolean>(false);
    const [isLoadingAPICategories, setIsLoadingAPICategories] = useState<boolean>(false);
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

    const getAllProducts = async (pageNo: number, filterSortBy: string, cateFilter: Array<string>) => {
        try {
            const resultcateFilterString = cateFilter.join(',');

            const productFilter: IProductFilter = {
                pageNo: pageNo,
                pageSize: itemsPerPage,
                key: searchItem,
                cate: resultcateFilterString,
                sort: filterSortBy,
            };

            setIsLoadingAPIProduct(true);
            const response = await getAllProductSearchWithinPagination(productFilter);
            setIsLoadingAPIProduct(false);

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

    const handleGetFilterSortBy = (event: SelectChangeEvent) => {
        setFilterSortBy(event.target.value as string);
        setPage(1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSelectCategoryFilter = (e: { target: { name: string } }) => {
        const updatedSelection = cateFilter.includes(e.target.name)
            ? cateFilter.filter((category) => category !== e.target.name)
            : [...cateFilter, e.target.name];

        setCateFilter(updatedSelection);
        setPage(1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const toggleMenu = useCallback(() => {
        setOpenMenuFilterResponsive((prev) => !prev);
    }, []);

    useEffect(() => {
        const handleGetCategories = async () => {
            try {
                setIsLoadingAPICategories(true);
                const response = await getAllCategoryWithPagination();
                setIsLoadingAPICategories(false);

                if (response.status === 200 && Array.isArray(response.data.content)) {
                    setCategories(response.data.content);
                } else {
                    setErrorAPI(true);
                }
            } catch (error) {
                setErrorAPI(true);
            }
        };

        handleGetCategories();
    }, []);

    useEffect(() => {
        getAllProducts(page, filterSortBy, cateFilter);
    }, [page, searchItem, filterSortBy, cateFilter]);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <section className="bg-gray-100 dark:bg-dark-400">
            <div className="sm:w-10/12 w-11/12 py-6 mx-auto relative">
                <ScrollButton />

                <div className="grid xl:grid-cols-12 gap-10 relative">
                    <div className="col-span-3 w-full h-[87vh] hidden xl:block sticky top-20 rounded z-40">
                        <div className=" w-full h-full pr-0.5 overflow-y-auto space-y-3">
                            <FormControl className="!rounded-lg" fullWidth variant="filled">
                                <InputLabel className="!font-bold !text-lg !rounded-lg">{t('sortBy')}</InputLabel>
                                <Select className="!rounded-lg" value={filterSortBy} onChange={handleGetFilterSortBy}>
                                    <MenuItem value={config.SearchFilter.random}>{t('notFilter')}</MenuItem>
                                    <MenuItem value={config.SearchFilter.favoriteAsc}>{t('likesLowToHigh')}</MenuItem>
                                    <MenuItem value={config.SearchFilter.favoriteDesc}>{t('likesHighToLow')}</MenuItem>
                                    <MenuItem value={config.SearchFilter.priceAsc}>{t('priceLowToHigh')}</MenuItem>
                                    <MenuItem value={config.SearchFilter.priceDesc}>{t('priceHighToLow')}</MenuItem>
                                    <MenuItem value={config.SearchFilter.ratingAsc}>{t('ratingLowToHigh')}</MenuItem>
                                    <MenuItem value={config.SearchFilter.ratingDesc}>{t('ratingHighToLow')}</MenuItem>
                                    <MenuItem value={config.SearchFilter.reviewAsc}>{t('reviewLowToHigh')}</MenuItem>
                                    <MenuItem value={config.SearchFilter.reviewDesc}>{t('reviewHighToLow')}</MenuItem>
                                </Select>
                            </FormControl>

                            <Accordion defaultExpanded className="!bg-transparent">
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="!bg-white dark:!bg-dark-300 !rounded-t-lg"
                                >
                                    <div className="font-bold">{t('category')}</div>
                                </AccordionSummary>
                                <AccordionDetails className="!bg-white dark:!bg-dark-300 !rounded-b-lg">
                                    <div className="flex flex-col gap-2">
                                        {isLoadingAPICategories
                                            ? Array(10)
                                                  .fill(null)
                                                  .map((_, index) => <Skeleton key={index} className="h-5" />)
                                            : categories.map((item, index) => (
                                                  <label
                                                      key={index}
                                                      className="inline-flex items-center cursor-pointer w-fit"
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          className="h-4 w-4 accent-primary-700 cursor-pointer"
                                                          checked={cateFilter.includes(item.name)}
                                                          onChange={handleSelectCategoryFilter}
                                                          name={item.name}
                                                      />
                                                      <span className="ml-2 text-sm">{item.name}</span>
                                                  </label>
                                              ))}
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                    <div className="col-span-1 xl:col-span-9 min-h-[87vh] flex flex-col">
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 ">
                            {isLoadingAPIProducts
                                ? Array(itemsPerPage)
                                      .fill(constants.initObjectProduct)
                                      .map((item, index) => (
                                          <Card
                                              key={index}
                                              itemProduct={item}
                                              loading={isLoadingAPIProducts}
                                              delay={(index % 3) / 5}
                                          />
                                      ))
                                : products.map((item, index) => (
                                      <Card
                                          key={index}
                                          itemProduct={item}
                                          loading={isLoadingAPIProducts}
                                          delay={(index % 3) / 5}
                                      />
                                  ))}
                        </div>
                        {!isLoadingAPIProducts && products.length === 0 && (
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
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                variant="outlined"
                                boundaryCount={1}
                            />
                        </div>
                    </div>
                </div>

                <div className="block xl:hidden fixed top-20 right-0 z-50 ">
                    <Button variant="fill" onClick={toggleMenu}>
                        <div className="text-lg normal-case">{t('filterProduct')}</div>
                    </Button>
                </div>

                <Drawer anchor="top" open={openMenuFilterResponsive} onClose={toggleMenu}>
                    <div className="h-screen px-5 space-y-3">
                        <div className="flex justify-between items-center my-5">
                            <span className="text-2xl font-bold tracking-wide">{t('filterProduct')}</span>
                            <Fab color="error" size="small">
                                <Close onClick={toggleMenu} />
                            </Fab>
                        </div>
                        <FormControl fullWidth variant="filled">
                            <InputLabel className="!font-bold !text-lg !rounded-lg">{t('sortBy')}</InputLabel>
                            <Select className="!rounded-lg" value={filterSortBy} onChange={handleGetFilterSortBy}>
                                <MenuItem value={config.SearchFilter.random}>{t('notFilter')}</MenuItem>
                                <MenuItem value={config.SearchFilter.favoriteAsc}>{t('likesLowToHigh')}</MenuItem>
                                <MenuItem value={config.SearchFilter.favoriteDesc}>{t('likesHighToLow')}</MenuItem>
                                <MenuItem value={config.SearchFilter.priceAsc}>{t('priceLowToHigh')}</MenuItem>
                                <MenuItem value={config.SearchFilter.priceDesc}>{t('priceHighToLow')}</MenuItem>
                                <MenuItem value={config.SearchFilter.ratingAsc}>{t('ratingLowToHigh')}</MenuItem>
                                <MenuItem value={config.SearchFilter.ratingDesc}>{t('ratingHighToLow')}</MenuItem>
                                <MenuItem value={config.SearchFilter.reviewAsc}>{t('reviewLowToHigh')}</MenuItem>
                                <MenuItem value={config.SearchFilter.reviewDesc}>{t('reviewHighToLow')}</MenuItem>
                            </Select>
                        </FormControl>

                        <Accordion defaultExpanded className="!bg-transparent">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                className="!bg-white dark:!bg-dark-400 !rounded-t-lg"
                            >
                                <div className="font-bold">{t('category')}</div>
                            </AccordionSummary>
                            <AccordionDetails className="!bg-white dark:!bg-dark-400 !rounded-b-lg">
                                <div className="flex flex-col gap-2">
                                    {isLoadingAPICategories
                                        ? Array(10)
                                              .fill(null)
                                              .map((_, index) => <Skeleton key={index} className="h-5" />)
                                        : categories.map((item, index) => (
                                              <label
                                                  key={index}
                                                  className="inline-flex items-center cursor-pointer w-fit"
                                              >
                                                  <input
                                                      type="checkbox"
                                                      className="h-4 w-4 accent-primary-700 cursor-pointer"
                                                      checked={cateFilter.includes(item.name)}
                                                      onChange={handleSelectCategoryFilter}
                                                      name={item.name}
                                                  />
                                                  <span className="ml-2 text-sm">{item.name}</span>
                                              </label>
                                          ))}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </Drawer>
            </div>
        </section>
    );
}

export default Listproducts;
