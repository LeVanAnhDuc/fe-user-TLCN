import Rating from '@mui/material/Rating';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { getSKUPrice, getSingleProduct } from '../../apis/productApi';
import IProduct from '../../interface/product';
import config from '../../config';
import { addToCart, getCartByToken } from '../../apis/cartApi';
import { setItemsOfCart, setToTalPriceCart, setToTalProductCart } from '../Cart/totalProductInCartSlice';
import { getCountItemOfWishList, putFollowProduct } from '../../apis/followProductApi';
import ReviewProductCurrent from './ReviewProduct';
import { setToTalWishList } from '../Profile/Wishlist/wishListSlice';
import RelatedProduct from './RelatedProduct';
import Button from '../../components/Button';
import { convertNumberToVND } from '../../utils/convertData';
import ChangeQuantityProduct from './ChangeQuantityProduct';

const DetailProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [favourite, setFavourite] = useState<boolean>(false);
    const [product, setProduct] = useState<IProduct>();
    const [ratingProduct, setRatingProduct] = useState<number>(0);
    const [categoryName, setcategoryName] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [size, setSize] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [picColor, setPicColor] = useState<string>('');
    const images = product?.listImages || [];

    const getProduct = async (id: number) => {
        try {
            if (id && !isNaN(+id)) {
                const response = await getSingleProduct(id);

                if (response && response.data) {
                    setProduct(response.data);
                    setFavourite(response.data.liked);
                    setRatingProduct(response.data.rating);
                    setcategoryName(response.data.categoryName);
                }
                if (response.status !== 200) {
                    toast.error(response.data.message);
                    navigate(config.Routes.shop);
                }
            } else {
                navigate(config.Routes.shop);
            }
        } catch {
            console.log('Đang bảo trì');
        }
    };

    const handleAddCart = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            if (id) {
                const productId: number = +id;
                const valueNames: Array<string> = [color, size];
                try {
                    const addToCartAPI = await addToCart(quantity, productId, valueNames);

                    if (addToCartAPI?.status === 201 && addToCartAPI?.data?.product?.name) {
                        const itemOfCart = await getCartByToken();

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
                } catch {
                    toast.error('Lỗi không thêm được sản phẩm');
                }
            }
        } else {
            toast.info('Bạn cần đăng nhập trước khi đặt hàng');
            navigate(config.Routes.logIn);
        }
    };

    const handleGetPrice = async () => {
        if (color && size && id) {
            try {
                const response = await getSKUPrice(+id, color, size);
                if (response.status === 200 && product) {
                    const updatedObject: IProduct = product;
                    updatedObject.price = response.data;
                    setProduct(updatedObject);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                console.log(`${error}`);
            }
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
            toast.info('Bạn cần đăng nhập để lưu sản phẩm yêu thích ');
            navigate(config.Routes.logIn);
        }
    };

    const handleChangeSize = (sizeOption: string) => {
        setSize(sizeOption);
    };

    const handleNextClick = () => {
        setPicColor('');
        const newIndex = (currentImageIndex + 1) % images.length;
        setCurrentImageIndex(newIndex);
    };

    const handlePreviousClick = () => {
        setPicColor('');
        if (currentImageIndex === 0) {
            setCurrentImageIndex(images.length - 1);
        } else {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleChangePicHover = (index: number) => {
        setPicColor('');
        setCurrentImageIndex(index);
    };
    const handleChangePicColor = (pic: { valueName: string; imageUrl: string }) => {
        setPicColor(pic.imageUrl);
        setColor(pic.valueName);
    };

    useEffect(() => {
        handleGetPrice();
    }, [id, color, size]);

    useEffect(() => {
        id && getProduct(+id);
        window.scrollTo({
            top: 0,
            behavior: 'instant',
        });
    }, [id]);

    return (
        <div className="bg-gray-100">
            <div className="w-11/12 sm:w-10/12 m-auto py-10 space-y-10">
                <div className="grid lg:grid-cols-12 gap-3">
                    <div className="hidden col-span-1 lg:block h-[30rem] space-y-2.5 overflow-y-auto hide-scrollbar ">
                        {images.map((item, index) => (
                            <img
                                src={item}
                                key={index}
                                alt={item}
                                className="w-full h-20 object-cover object-center rounded hover:scale-95 transition"
                                onMouseEnter={() => handleChangePicHover(index)}
                            />
                        ))}
                    </div>
                    <div className="lg:col-span-11 grid lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-7 lg:h-[30rem] flex gap-1 relative">
                            <img
                                src={picColor ? picColor : images[currentImageIndex]}
                                alt="image"
                                className="size-full object-cover object-center rounded-lg"
                            />
                            <div className="w-full flex justify-end gap-2.5 absolute top-5 -left-5 ">
                                <Button
                                    variant="outlineBlur"
                                    className="!rounded-full !p-3 bg-white/30"
                                    onClick={handlePreviousClick}
                                >
                                    <>
                                        <div className="absolute bg-white size-full rounded-full blur-xl p-7"></div>
                                        <NavigateBefore className="z-10" />
                                    </>
                                </Button>
                                <Button
                                    variant="outlineBlur"
                                    className="!rounded-full !p-3 bg-white/30"
                                    onClick={handleNextClick}
                                >
                                    <>
                                        <div className="absolute bg-white size-full rounded-full blur-xl p-7"></div>
                                        <NavigateNext className="z-10" />
                                    </>
                                </Button>
                            </div>
                        </div>
                        <div className="lg:col-span-5 space-y-7">
                            <div className="xl:text-lg font-medium">{product?.name}</div>
                            <div className="flex items-center justify-between text-sm gap-1 xl:text-base">
                                <div className="space-x-1 text-red-500 font-medium">
                                    <span>{convertNumberToVND(product?.price)}</span>
                                    <span className="text-sm">đ</span>
                                </div>
                                <span className="text-gray-400">|</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">{product?.rating}/5</span>
                                    <Rating readOnly value={ratingProduct} precision={0.1} size="small" />
                                </div>
                                <span className="text-gray-400 px-3">|</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">{product?.numberOfRatings}</span>
                                    <span>Đánh giá</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-7">
                                <div className="space-y-2">
                                    <span className="font-medium">Kích thước : {size}</span>
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
                                                        className="!rounded-full !p-1 !size-fit min-h-11 min-w-11 flex justify-center items-center"
                                                        onClick={() => handleChangeSize(item.valueName)}
                                                    >
                                                        <span className="text-sm font-medium">{item.valueName}</span>
                                                    </Button>
                                                )),
                                            )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="font-medium">Màu sắc : {color}</span>
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
                                                        className="!rounded-full !p-0 !size-11 overflow-hidden flex justify-center items-center"
                                                        onClick={() => handleChangePicColor(item)}
                                                    >
                                                        <img
                                                            className="object-cover bg-center p-1 rounded-full"
                                                            src={item.imageUrl}
                                                        />
                                                    </Button>
                                                )),
                                            )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="font-medium">Số lượng</span>
                                <div className="flex items-center gap-10">
                                    <ChangeQuantityProduct quantity={quantity} setQuantity={setQuantity} />
                                    <div className="whitespace-nowrap space-x-2">
                                        <span className="font-medium">{product?.quantityAvailable}</span>
                                        <span className="text-gray-500 ">sản phẩm có sẵn</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Button
                                    fullWidth
                                    disabled={color && size ? false : true}
                                    variant="fill"
                                    onClick={handleAddCart}
                                    className="uppercase"
                                >
                                    Thêm vào giỏ
                                </Button>
                                <Button
                                    variant={favourite ? 'fill' : 'outline'}
                                    className="!rounded-full !p-3 border-2"
                                    onClick={handleToggleFavorite}
                                >
                                    {favourite ? (
                                        <Favorite className="text-primary-800" />
                                    ) : (
                                        <FavoriteBorder className="text-primary-800 " />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-5 space-y-5">
                    <div className="text-lg font-medium">MÔ TẢ SẢN PHẨM</div>
                    <div>{product?.description}</div>
                </div>

                <div className="mt-5">
                    <ReviewProductCurrent idProduct={id ? +id : 0} rating={ratingProduct} />
                </div>

                <div className="mt-5">
                    <RelatedProduct categoryName={categoryName} />
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;
