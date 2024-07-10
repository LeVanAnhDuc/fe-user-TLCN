// libs
import Rating from '@mui/material/Rating';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
// types
import IProduct, { actionProduct } from '@/types/product';
// components
import Button from '@/components/Button';
import ChangeQuantityProduct from './ChangeQuantityProduct';
import RelatedProduct from './mains/RelatedProduct';
import DescriptionProduct from './mains/DescriptionProduct';
import ReviewProduct from './mains/ReviewProduct';
import ImagesProduct from './mains/ImagesProduct';
import ImageCenter from './mains/ImageCenter';
// ghosts
import ViewAnalysis from './ghosts/ViewAnalysis';
import GetProduct from './ghosts/GetProduct';
import GetPriceBySKU from './ghosts/GetPriceBySKU';
// apis
import { updateProductAnalysis } from '@/apis/productApi';
import { addToCart, getCartByToken } from '@/apis/cartApi';
import { getCountItemOfWishList, putFollowProduct } from '@/apis/followProductApi';
// others
import config from '@/config';
import { setToTalWishList } from '../Profile/Wishlist/wishListSlice';
import { setItemsOfCart, setToTalPriceCart, setToTalProductCart } from '../Cart/cartSlice';
import { convertNumberToVND } from '@/utils/convertData';

const DetailProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation('detailProduct');

    const [favourite, setFavourite] = useState<boolean>(false);
    const [product, setProduct] = useState<IProduct>();
    const [ratingProduct, setRatingProduct] = useState<number>(0);
    const [categoryName, setCategoryName] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [size, setSize] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [picColor, setPicColor] = useState<string>('');
    const [quantityAvailableItem, setQuantityAvailableItem] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);

    const handleAddCart = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            if (id) {
                const productId: number = +id;
                const valueNames: Array<string> = [color, size];
                try {
                    const addToCartAPI = await addToCart(quantity, productId, valueNames);

                    if (addToCartAPI?.status === 201 && addToCartAPI?.data?.product?.name) {
                        const actionAddToCart: actionProduct = 'add_cart';

                        const [itemOfCart] = await Promise.all([
                            getCartByToken(),
                            updateProductAnalysis(productId, actionAddToCart),
                        ]);

                        if (itemOfCart.status === 200) {
                            dispatch(setItemsOfCart(itemOfCart?.data?.cartItems));
                            dispatch(setToTalPriceCart(itemOfCart?.data?.totalPrice));
                            dispatch(setToTalProductCart(itemOfCart.data.totalItems));
                        }

                        setSize('');
                        setColor('');
                        setQuantity(1);
                    } else {
                        toast.info(addToCartAPI.data.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            toast.info(t('requireLogin'));
            navigate(config.Routes.logIn);
        }
    };

    const handleToggleFavorite = async () => {
        const token = localStorage.getItem('accessToken');
        if (token && id) {
            setFavourite((prev) => !prev);
            try {
                await putFollowProduct(+id);
                const response = await getCountItemOfWishList();
                dispatch(setToTalWishList(+response.data));
            } catch (error) {
                console.log(`${error}`);
            }
        } else {
            toast.info(t('requireLogin'));
            navigate(config.Routes.logIn);
        }
    };

    const handleChangeSize = (sizeOption: string) => {
        setSize(sizeOption);
    };

    const handleChangePicColor = (pic: { valueName: string; imageUrl: string }) => {
        setPicColor(pic.imageUrl);
        setColor(pic.valueName);
    };

    return (
        <>
            <ViewAnalysis id={id} />
            <GetProduct
                {...{
                    setProduct,
                    setFavourite,
                    setRatingProduct,
                    setCategoryName,
                    id,
                    setQuantityAvailableItem,
                    setImages,
                }}
            />
            <GetPriceBySKU {...{ color, size, id, product, setProduct, setQuantityAvailableItem }} />

            <div className="bg-gray-100 dark:bg-dark-400">
                <div className="w-11/12 sm:w-10/12 m-auto py-10 space-y-10">
                    <div className="grid lg:grid-cols-12 gap-3">
                        <ImagesProduct {...{ product, setPicColor, setCurrentImageIndex }} />
                        <div className="lg:col-span-11 grid lg:grid-cols-12 gap-10">
                            <ImageCenter
                                {...{
                                    picColor,
                                    images,
                                    currentImageIndex,
                                    setPicColor,
                                    setCurrentImageIndex,
                                }}
                            />
                            <div className="lg:col-span-5 xl:col-span-6 space-y-7">
                                <div className="xl:text-lg font-medium">{product?.name}</div>
                                <div className="flex flex-wrap items-center justify-between text-sm gap-1 xl:text-base">
                                    <div className="flex gap-2 font-medium">
                                        <div className="space-x-1 text-red-500">
                                            <span>{convertNumberToVND(product?.price)}</span>
                                            <span className="text-sm">đ</span>
                                        </div>
                                        {product?.percentDiscount !== 0 && (
                                            <div className="space-x-1 text-gray-400 line-through">
                                                <span>{convertNumberToVND(product?.originalPrice)}</span>
                                                <span className="text-sm">đ</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-gray-400">|</span>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">{product?.rating}/5</span>
                                        <Rating readOnly value={ratingProduct} precision={0.1} size="small" />
                                    </div>
                                    <span className="text-gray-400 px-3">|</span>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">{product?.numberOfRatings}</span>
                                        <span>{t('review')}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-7">
                                    <div className="space-y-2">
                                        <span className="font-medium">
                                            {t('size')} : {size}
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {product?.options
                                                .filter(
                                                    (option) =>
                                                        option.optionName.toLowerCase() === 'size' ||
                                                        option.optionName.toLowerCase() === 'kích thước',
                                                )
                                                .flatMap((filteredOption) =>
                                                    filteredOption.values.map((item, index) => (
                                                        <Button
                                                            key={index}
                                                            variant={size === item.valueName ? 'fill' : 'outline'}
                                                            className="!rounded-lg !p-1 !size-fit min-h-11 min-w-11 flex justify-center items-center"
                                                            onClick={() => handleChangeSize(item.valueName)}
                                                        >
                                                            <span className="text-sm font-medium">
                                                                {item.valueName}
                                                            </span>
                                                        </Button>
                                                    )),
                                                )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="font-medium">
                                            {t('color')} : {color}
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {product?.options
                                                .filter(
                                                    (option) =>
                                                        option.optionName.toLowerCase() === 'màu' ||
                                                        option.optionName.toLowerCase() === 'color',
                                                )
                                                .flatMap((filteredOption) =>
                                                    filteredOption.values.map((item, index) => (
                                                        <Button
                                                            key={index}
                                                            variant={color === item.valueName ? 'fill' : 'outline'}
                                                            className="!rounded-lg !p-0 !size-11 overflow-hidden flex justify-center items-center"
                                                            onClick={() => handleChangePicColor(item)}
                                                        >
                                                            <img
                                                                className="object-cover bg-center p-1 rounded-lg"
                                                                src={item.imageUrl}
                                                            />
                                                        </Button>
                                                    )),
                                                )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="font-medium">{t('quantity')}</span>
                                    <div className="flex items-center gap-10">
                                        <ChangeQuantityProduct quantity={quantity} setQuantity={setQuantity} />
                                        <div className="whitespace-nowrap space-x-2">
                                            <span className="font-medium">{quantityAvailableItem}</span>
                                            <span className="text-gray-500 dark:text-gray-300 text-sm">
                                                {t('productsAvailable')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <Button
                                        fullWidth
                                        disabled={color && size && quantityAvailableItem > 0 ? false : true}
                                        variant="fill"
                                        onClick={handleAddCart}
                                        className="uppercase"
                                    >
                                        {t('addToCart')}
                                    </Button>
                                    <Button
                                        variant={favourite ? 'fill' : 'outline'}
                                        className="!rounded-full !p-3 border-2"
                                        onClick={handleToggleFavorite}
                                    >
                                        {favourite ? <Favorite /> : <FavoriteBorder />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DescriptionProduct product={product} />
                    <ReviewProduct idProduct={id ? +id : 0} rating={ratingProduct} />
                    <RelatedProduct categoryName={categoryName} />
                </div>
            </div>
        </>
    );
};

export default DetailProduct;
