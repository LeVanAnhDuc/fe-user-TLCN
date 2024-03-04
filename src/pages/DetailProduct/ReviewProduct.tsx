import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';

import Review from '../../components/Review/Review';
import { getAllReviewWithPagination } from '../../apis/reviewApi';
import Ireview, { IStarNumberOfProduct } from '../../interface/review';
import Button from '../../components/Button';

interface Iprops {
    idProduct: number;
    rating: number;
}

const ReviewProduct = (props: Iprops) => {
    const { idProduct, rating } = props;
    const itemsPerPage = 4;

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
        } catch {
            toast.error('Đang bảo trì');
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

        const scrollToComponent = () => {
            if (targetComponentRef.current) {
                targetComponentRef.current.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        };
        scrollToComponent();
    }, [idProduct, page, starActive]);

    return (
        <div ref={targetComponentRef} className="rounded-lg bg-white ">
            <div className="text-lg font-medium p-5 ">ĐÁNH GIÁ SẢN PHẨM</div>
            <div className="bg-primary-100 py-5 grid grid-cols-8">
                <div className="col-span-3 lg:col-span-2 text-center space-y-1">
                    <div className="text-red-500">
                        <span className="text-xl font-bold">{rating}&nbsp;</span>
                        <span>trên 5</span>
                    </div>
                    <Rating readOnly value={rating} precision={0.01} />
                </div>

                <div className="col-span-5 lg:col-span-6 flex flex-wrap items-center gap-3">
                    <Button
                        className="w-28"
                        variant={starActive === null ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(null)}
                    >
                        Tất cả ({numberListStar?.all})
                    </Button>
                    <Button
                        className="w-28"
                        variant={starActive === 5 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(5)}
                    >
                        5 sao ({numberListStar?.fiveStar})
                    </Button>
                    <Button
                        className="w-28"
                        variant={starActive === 4 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(4)}
                    >
                        4 sao ({numberListStar?.fourStar})
                    </Button>
                    <Button
                        className="w-28"
                        variant={starActive === 3 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(3)}
                    >
                        3 sao ({numberListStar?.threeStar})
                    </Button>
                    <Button
                        className="w-28"
                        variant={starActive === 2 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(2)}
                    >
                        2 sao ({numberListStar?.twoStar})
                    </Button>
                    <Button
                        className="w-28"
                        variant={starActive === 1 ? 'fill' : 'outline'}
                        onClick={() => handleChangeStar(1)}
                    >
                        1 sao ({numberListStar?.oneStar})
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
