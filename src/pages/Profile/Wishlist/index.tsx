// libs
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// types
import IFollowProduct from '@/interface/followProduct';
// components
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Error404 from '@/pages/Error404';
// ghosts
import GetPriorityProducts from './ghosts/GetPriorityProducts';
// others
import config from '@/config';

import PriorityProducts from './mains/PriorityProducts';
import Pagination from '@/components/Pagination';

const Wishlist = () => {
    const { t } = useTranslation('wishList');

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [priorityProducts, SetPriorityProducts] = useState<Array<IFollowProduct>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(0);
    const [behaviorGetPriorityProducts, setBehaviorGetPriorityProducts] = useState<boolean>(false);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetPriorityProducts
                {...{
                    page,
                    firstLoadingAPI,
                    setLoadingAPI,
                    setFirstLoadingAPI,
                    SetPriorityProducts,
                    setTotalPages,
                    setErrorAPI,
                    behaviorGetPriorityProducts,
                }}
            />

            {isLoadingAPI ? (
                <Loading />
            ) : (
                <div className="size-full relative">
                    {priorityProducts.length === 0 ? (
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
                            <PriorityProducts {...{ priorityProducts, setBehaviorGetPriorityProducts }} />
                            <div className="size-fit flex absolute bottom-0 right-0">
                                <Pagination {...{ totalPages, page, setPage }} />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Wishlist;
