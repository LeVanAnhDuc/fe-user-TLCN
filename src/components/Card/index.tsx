// libs
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Rating from '@mui/material/Rating';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
// types
import IProduct, { actionProduct } from '../../types/product';
// components
import Button from '../Button';
import Skeleton from '../Skeleton';
import AnimationTran from '../AnimationTran';
// apis
import { getCountItemOfWishList, putFollowProduct } from '../../apis/followProductApi';
import { updateProductAnalysis } from '../../apis/productApi';
// others
import config from '../../config';
import { setToTalWishList } from '../../pages/Profile/Wishlist/wishListSlice';

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
    const [isHovered, setIsHovered] = useState(false);

    const handleChangeFavorite = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await putFollowProduct(+itemProduct.id);

                if (response.status === 200) {
                    const totalFavourite = await getCountItemOfWishList();
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

    const handleNextDetailPage = async () => {
        if (itemProduct.id) {
            navigate(`${config.Routes.detailProduct}/${itemProduct.id}`);
            const actionClick: actionProduct = 'click';
            await updateProductAnalysis(+itemProduct.id, actionClick);
        }
    };

    useEffect(() => {
        setFavourite(itemProduct.liked ? true : false);
    }, [loading]);

    return (
        <AnimationTran tranY={30} delay={delay}>
            <div className="bg-white shadow-md rounded-md overflow-hidden relative hover:shadow-primary-800 hover:scale-[1.02] hover:-translate-y-0.5 transition dark:bg-dark-500">
                <div onClick={handleNextDetailPage} className="cursor-pointer">
                    <div
                        className="h-72 w-full overflow-hidden relative flex"
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
                                        isHovered && '-translate-x-full'
                                    } object-cover object-center h-full min-w-full transition duration-[900ms]`}
                                />
                                <motion.img
                                    src={itemProduct.listImages[1]}
                                    alt={itemProduct.name}
                                    className={`${
                                        isHovered && '-translate-x-full'
                                    } object-cover object-center h-full min-w-full transition duration-[900ms]`}
                                />
                            </>
                        )}
                    </div>
                    <div className="m-4 font-medium space-y-3">
                        {loading ? (
                            <Skeleton fillFull className="h-9" />
                        ) : (
                            <div className="line-clamp-2 text-sm min-h-10 uppercase">{itemProduct.name}</div>
                        )}
                        <div className="flex items-center gap-3">
                            {loading ? (
                                <Skeleton className="h-6" fullWidth />
                            ) : (
                                <div className="text-red-500 flex gap-0.5">
                                    <span className="text-sm">đ</span>
                                    {itemProduct.price.toLocaleString('vi-VN')}
                                </div>
                            )}
                            {loading ? (
                                <Skeleton className="h-6" fullWidth />
                            ) : (
                                itemProduct.percentDiscount !== 0 && (
                                    <div className="text-gray-400 flex gap-0.5 line-through">
                                        <span className="text-sm">đ</span>
                                        {itemProduct.originalPrice.toLocaleString('vi-VN')}
                                    </div>
                                )
                            )}
                        </div>
                        <div className="flex justify-between gap-5">
                            {loading ? (
                                <Skeleton className="h-6" fullWidth />
                            ) : (
                                <Rating value={itemProduct.rating} precision={0.5} readOnly size="small" />
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

                {!loading && (
                    <>
                        {itemProduct.percentDiscount !== 0 && (
                            <div className="absolute top-2 left-2 bg-gray-700 rounded-full text-white size-11 text-sm flex items-center justify-center">
                                -{itemProduct.percentDiscount}%
                            </div>
                        )}
                        <div className="bg-white blur-lg absolute -top-1 right-1.5 size-14 rounded-full"></div>
                        <Button onClick={handleChangeFavorite} className="!absolute top-0 right-0 ">
                            {favourite ? (
                                <Favorite className="!text-primary-700  rounded-full" fontSize="large" />
                            ) : (
                                <FavoriteBorder className="!text-primary-700  rounded-full" fontSize="large" />
                            )}
                        </Button>
                    </>
                )}
            </div>
        </AnimationTran>
    );
};

export default Card;
