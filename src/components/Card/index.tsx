import ShoppingCart from '@mui/icons-material/ShoppingCart';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Rating from '@mui/material/Rating';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import config from '../../config';
import IProduct from '../../interface/product';
import { getCountItemOfWishList, putFollowProduct } from '../../apis/followProductApi';
import { setToTalWishList } from '../../pages/Profile/Wishlist/wishListSlice';
import Button from '../Button';
import Skeleton from '../Skeleton';
import AnimationTran from '../AnimationTran';

interface Iprops {
    itemProduct: IProduct;
    loading?: boolean;
    delay?: number;
}

const Card = (props: Iprops) => {
    const { itemProduct, loading = false, delay = 0 } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation('card');

    const [favourite, setFavourite] = useState(itemProduct.liked ? true : false);
    const [favoriteCount, setFavouriteCount] = useState(itemProduct.favoriteCount);
    const [isHovered, setIsHovered] = useState(false);

    const handleChangeFavorite = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await putFollowProduct(+itemProduct.id);

                if (response.status === 200) {
                    const totalFavourite = await getCountItemOfWishList();
                    if (favourite) {
                        setFavouriteCount((prev) => prev - 1);
                    } else {
                        setFavouriteCount((prev) => prev + 1);
                    }
                    setFavourite((prev) => !prev);
                    dispatch(setToTalWishList(+totalFavourite.data));
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            toast.warning(t('requireLogin'));
            navigate(config.Routes.logIn);
        }
    };

    const handleNextDetailPage = () => {
        if (itemProduct.id) {
            navigate(`${config.Routes.detailProduct}/${itemProduct.id}`);
        }
    };

    useEffect(() => {
        setFavourite(itemProduct.liked ? true : false);
        setFavouriteCount(itemProduct.favoriteCount);
    }, [loading]);

    return (
        <AnimationTran tranY={30} delay={delay}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden relative hover:shadow-primary-800 hover:scale-[1.02] hover:-translate-y-0.5 transition dark:bg-dark-600">
                <div onClick={handleNextDetailPage} className="cursor-pointer">
                    <div
                        className="h-52 w-full overflow-hidden relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {loading ? (
                            <Skeleton fillFull />
                        ) : (
                            <>
                                <motion.img
                                    src={itemProduct.listImages[0]}
                                    alt={itemProduct.name}
                                    className={`${
                                        isHovered && '-translate-y-52'
                                    } object-cover object-center size-full transition duration-700`}
                                />
                                <motion.img
                                    src={itemProduct.listImages[1]}
                                    alt={itemProduct.name}
                                    className={`${
                                        isHovered && '-translate-y-52'
                                    } object-cover object-center size-full transition duration-700`}
                                />
                            </>
                        )}
                    </div>
                    <div className="mx-4 my-3 font-medium space-y-2.5">
                        {loading ? (
                            <Skeleton fillFull className="h-9" />
                        ) : (
                            <div className="line-clamp-2 text-sm min-h-10">{itemProduct.name}</div>
                        )}
                        <div className="flex justify-between gap-5">
                            {loading ? (
                                <Skeleton className="h-6" fullWidth />
                            ) : (
                                <div className="text-base text-red-500 flex gap-0.5">
                                    <span className="text-sm">đ</span>
                                    {itemProduct.price.toLocaleString('vi-VN')}
                                </div>
                            )}
                            {loading ? (
                                <Skeleton className="h-6" fullWidth />
                            ) : (
                                <Rating value={itemProduct.rating} precision={0.5} readOnly size="small" />
                            )}
                        </div>
                        <div className="flex justify-between gap-5">
                            {loading ? (
                                <Skeleton className="h-6" fullWidth />
                            ) : (
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('preference')} {favoriteCount}
                                </span>
                            )}
                            {loading ? (
                                <Skeleton className="h-6" fullWidth />
                            ) : (
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('sold')} {itemProduct.sold}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="m-4">
                    {loading ? (
                        <Skeleton className="h-12" fullWidth />
                    ) : (
                        <Button fullWidth variant="outline" onClick={handleNextDetailPage}>
                            <ShoppingCart />
                        </Button>
                    )}
                </div>

                {!loading && (
                    <>
                        <div className="bg-white blur-lg absolute -top-1 right-1.5 size-14 rounded-full"></div>
                        <Button onClick={handleChangeFavorite} className="!absolute top-0 right-0 ">
                            {favourite ? (
                                <Favorite className="!text-primary-700  rounded-full " fontSize="large" />
                            ) : (
                                <FavoriteBorder className="!text-primary-700  rounded-full " fontSize="large" />
                            )}
                        </Button>
                    </>
                )}
            </div>
        </AnimationTran>
    );
};

export default Card;
