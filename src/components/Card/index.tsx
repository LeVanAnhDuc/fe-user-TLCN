import ShoppingCart from '@mui/icons-material/ShoppingCart';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Rating from '@mui/material/Rating';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import config from '../../config';
import IProduct from '../../interface/product';
import { getCountItemOfWishList, putFollowProduct } from '../../apis/followProductApi';
import { setToTalWishList } from '../../pages/Profile/Wishlist/wishListSlice';
import Button from '../Button';
import Skeleton from '../Skeleton';
import AnimationTran from '../AnimationTran';

<<<<<<< HEAD
interface Iprops {
    itemProduct: IProduct;
    loading?: boolean;
    delay?: number;
}

const Card = (props: Iprops) => {
    const { itemProduct, loading = false, delay = 0 } = props;
=======

const Card = (props: { itemProduct: IProduct }) => {
    const { itemProduct } = props;
>>>>>>> acbca2eab1b040ecc49f61721eabd7274043e2d6
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation('card');

    const [favourite, setFavourite] = useState(itemProduct.liked ? true : false);
    const [favoriteCount, setFavouriteCount] = useState(itemProduct.favoriteCount);

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
<<<<<<< HEAD
        <AnimationTran tranY={30} delay={delay}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden relative hover:shadow-primary-800 hover:scale-[0.98] hover:-translate-y-1 transition dark:bg-dark-600">
                <div onClick={handleNextDetailPage} className="cursor-pointer">
                    <div className="h-48 overflow-hidden ">
                        {loading ? (
                            <Skeleton fillFull />
                        ) : (
                            <img
                                src={itemProduct.listImages[0]}
                                alt={itemProduct.name}
                                className="object-cover object-center size-full"
                            />
                        )}
                    </div>
                    <div className="mx-4 my-3 font-medium space-y-3">
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
=======
        <div className="shadow-lg p-0 rounded-lg bg-[#FFFF]">
            <div onClick={handleNextDetailPage} className="cursor-pointer">
                <Box
                    sx={{
                        height: '25vh', // Chiều cao cố định
                        overflow: 'hidden',
                        margin: 1,
                        '&:hover .image': {
                            transform: 'scale(1.2)',
                        },
                    }}
                >
                    <CardMedia
                        className="image"
                        sx={{
                            width: '100%',
                            height: '100%',
                            transition: 'transform 0.2s',
                        }}
                        image={itemProduct.listImages[0]}
                    />
                </Box>
            </div>
            <CardContent>
                <div className="font-medium text-base grid gap-1 mb-0">
                    <div className="two-lines">
                        {itemProduct.name}
                    </div>
                    <div className="flex justify-between mt-3">
                        <span>
                            <span className="dong">đ</span>
                            <span className='list-price'>
                                {itemProduct.price.toLocaleString('vi-VN')}
                            </span>
                        </span>
                        <Rating defaultValue={itemProduct.rating} precision={0.5} readOnly sx={{ fontSize: '1.2rem' }}/>
                    </div>
                </div>
            </CardContent>
            <CardActions>
                <Button fullWidth variant="outlined" onClick={handleNextDetailPage}>
                    +<ShoppingCart />
                </Button>
                <Button onClick={handleChangeFavorite}>
                    {favourite ? <Favorite sx={{ color: 'black' }} /> : <FavoriteBorder sx={{ color: 'black' }} />}
                </Button>
            </CardActions>
        </div>
>>>>>>> acbca2eab1b040ecc49f61721eabd7274043e2d6
    );
};

export default Card;
