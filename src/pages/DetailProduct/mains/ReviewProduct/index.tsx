// libs
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
// types
import Ireview, { IStarNumberOfProduct } from '@/types/review';
// components
import Review from '@/components/Review/Review';
import Button from '@/components/Button';
// apis
import { getAllReviewWithPagination } from '@/apis/reviewApi';
// hooks
import useUpdateEffect from '@/hook/useUpdateEffect';

interface Iprops {
    idProduct: number;
    rating: number;
}

const ReviewProduct = (props: Iprops) => {
    const { idProduct, rating } = props;
    const itemsPerPage = 4;
    const { t } = useTranslation('detailProduct');

    const [reviews, setReviews] = useState<Array<Ireview>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [numberListStar, setNumberListStar] = useState<IStarNumberOfProduct>();
    const [starActive, setStarActive] = useState<number | null>(null);

    const targetComponentRef = useRef<HTMLDivElement | null>(null);

    const getAllReviewOfProduct = async () => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                const response = await getAllReviewWithPagination(idProduct, page, itemsPerPage, starActive);

                if (response.status === 200) {
                    setReviews(response.data.content);
                    setTotalPages(response.data.totalPages);
                    setNumberListStar(response.data.starNumber);
                } else {
                    toast.error(response.data.message || response.data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeStar = useCallback((value: number | null) => {
        setStarActive(value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    }, []);

    useEffect(() => {
        getAllReviewOfProduct();
    }, [page, starActive]);

    useUpdateEffect(() => {
        const scrollToComponent = () => {
            if (targetComponentRef.current) {
                targetComponentRef.current.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        };
        scrollToComponent();
    }, [page, starActive]);

    return (
        <div ref={targetComponentRef} className="rounded-lg bg-white dark:bg-dark-600">
            <div className="text-lg font-medium p-5 uppercase">{t('productReviews')}</div>
            <div className="bg-primary-50 py-5 grid grid-cols-8 dark:bg-primary-900">
                <div className="col-span-3 lg:col-span-2 text-center space-y-1">
                    <div className="text-red-500">
                        <span className="text-xl font-bold">{rating}&nbsp;</span>
                        <span>{t('outOf')} 5</span>
                    </div>
                    <Rating readOnly value={rating} precision={0.01} />
                </div>

                <div className="col-span-5 lg:col-span-6 flex flex-wrap items-center gap-3">
                    <Button
                        className="w-32"
                        variant={starActive === null ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(null)}
                    >
                        {t('all')} ({numberListStar?.all})
                    </Button>
                    <Button
                        className="w-32"
                        variant={starActive === 5 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(5)}
                    >
                        5 {t('star')} ({numberListStar?.fiveStar})
                    </Button>
                    <Button
                        className="w-32"
                        variant={starActive === 4 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(4)}
                    >
                        4 {t('star')} ({numberListStar?.fourStar})
                    </Button>
                    <Button
                        className="w-32"
                        variant={starActive === 3 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(3)}
                    >
                        3 {t('star')} ({numberListStar?.threeStar})
                    </Button>
                    <Button
                        className="w-32"
                        variant={starActive === 2 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(2)}
                    >
                        2 {t('star')} ({numberListStar?.twoStar})
                    </Button>
                    <Button
                        className="w-32"
                        variant={starActive === 1 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(1)}
                    >
                        1 {t('star')} ({numberListStar?.oneStar})
                    </Button>
                </div>
            </div>
            {reviews.map((item, index) => (
                <Review key={index} item={item} delay={(index % 4) / 20} />
            ))}
            <div className="flex justify-end p-5">
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
    );
};

export default ReviewProduct;
