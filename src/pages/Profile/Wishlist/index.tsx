import Pagination from '@mui/material/Pagination';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Image from '../../../components/Image';
import { getCountItemOfWishList, getWishListWithPagination, putFollowProduct } from '../../../apis/followProductApi';
import IFollowProduct from '../../../interface/followProduct';
import config from '../../../config';
import { setToTalWishList } from './wishListSlice';
import { convertNumberToVND } from '../../../utils/convertData';
import AnimationTran from '../../../components/AnimationTran';
import Button from '../../../components/Button';
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';
import Error404 from '../../Error404';
import Loading from '../../../components/Loading';

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const itemsPerPage = 20;
    const { t } = useTranslation('wishList');

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [wishList, setWishList] = useState<Array<IFollowProduct>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(0);

    const getAllFollowProduct = async (pageNo: number) => {
        try {
            firstLoadingAPI && setLoadingAPI(true);

            const [response] = await Promise.all([
                getWishListWithPagination(pageNo, itemsPerPage),
                firstLoadingAPI && new Promise((resolve) => setTimeout(resolve, 250)),
            ]);

            firstLoadingAPI && setLoadingAPI(false);

            if (response?.status === 200) {
                setFirstLoadingAPI(false);
                const { content, totalPages } = response.data;

                setWishList(content);
                setTotalPages(totalPages);
            } else {
                setErrorAPI(true);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    const handleToggleFavourite = async (idProduct: number) => {
        try {
            await putFollowProduct(idProduct);

            const response = await getCountItemOfWishList();

            if (response.status === 200) {
                dispatch(setToTalWishList(+response.data));
                getAllFollowProduct(page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllFollowProduct(page);
    }, [page]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
        window.scrollTo({
            top: 0,
            behavior: 'instant',
        });
    };

    const handleRedirectDetailItem = (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
        }
    };

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            {isLoadingAPI ? (
                <Loading />
            ) : (
                <div className="size-full relative">
                    {wishList.length === 0 ? (
                        <div className="size-full flex  flex-col items-center justify-center gap-5">
                            <ContentPasteSearch
                                sx={{ fontSize: '100px' }}
                                className="text-gray-400 dark:text-gray-200"
                            />
                            <span className="text-xl text-gray-400 dark:text-gray-200">{t('noWishList')}</span>
                            <Link to={config.Routes.shop}>
                                <Button variant="fill">{t('shop')}</Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 pb-16">
                                {wishList.map((item, index) => (
                                    <AnimationTran
                                        tranY={100}
                                        key={index}
                                        className="h-fit w-full grid grid-cols-12 bg-white rounded-lg overflow-hidden dark:bg-dark-600"
                                        delay={(index % 4) / 20}
                                    >
                                        <Image
                                            src={item.product.imageUrl}
                                            alt={'image' + item.product.name}
                                            className="col-span-3 md:col-span-2 object-cover object-center size-full cursor-pointer max-h-36 max-w-36"
                                            onClick={() => handleRedirectDetailItem(item.product.productId)}
                                        />
                                        <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between p-3 sm:p-4">
                                            <div className="line-clamp-2 font-semibold mb-3">{item.product.name}</div>
                                            <div className="flex justify-between items-center flex-wrap gap-1">
                                                <div className="flex gap-2 items-center">
                                                    <span className="font-bold ">{t('price')}: </span>
                                                    <span className="not-italic font-medium text-red-500 flex gap-1">
                                                        {convertNumberToVND(item.product.price)}
                                                        <span className="text-xs"> đ</span>
                                                    </span>
                                                </div>
                                                <div className="w-full flex items-center gap-3 sm:w-fit justify-between">
                                                    <Button
                                                        onClick={() => handleToggleFavourite(item.product.productId)}
                                                        className="text-sm !p-2 !h-11"
                                                        variant="outline"
                                                    >
                                                        {t('unFavourite')}
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleRedirectDetailItem(item.product.productId)}
                                                        className="text-sm !p-2 !h-11"
                                                        variant="fill"
                                                    >
                                                        {t('buyNow')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </AnimationTran>
                                ))}
                            </div>
                            <div className="size-fit flex absolute bottom-0 right-0">
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    variant="outlined"
                                    boundaryCount={1}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Wishlist;
