import { SetStateAction, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import ShoppingCart from '@mui/icons-material/ShoppingCart';

import { getSKUPrice, getSingleProduct } from '../../apis/productApi';
import IProduct from '../../interface/product';

import BootstrapButton from './Button/BootstrapButton';
import config from '../../config';
import { addToCart, getCountItemOfCart } from '../../apis/cartApi';
import OutlinedInput from '@mui/material/OutlinedInput';
import Image from '../../components/Image';
import { useDispatch } from 'react-redux';
import { setToTalProductCart } from '../Cart/totalProductInCartSlice';
import Rating from '@mui/material/Rating';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { getCountItemOfWishList, putFollowProduct } from '../../apis/followProductApi';
import ReviewProductCurrent from './ReviewProductCurrent/ReviewProductCurrent';
import { setToTalWishList } from '../Profile/Wishlist/wishListSlice';
import RelatedProduct from './RelatedProduct/RelatedProduct';

const DetailProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // handle data
    const [favourite, setFavourite] = useState<boolean>(false);
    const [product, setProduct] = useState<IProduct>(); // Dữ liệu từ API
    const [ratingProduct, setRatingProduct] = useState<number>(0);
    const [categoryName, setcategoryName] = useState<string>('');

    const getProduct = async (id: number) => {
        try {
            if (id && !isNaN(+id)) {
                // tồn tai ma san pham và phải là số
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
            toast.error('Đang bảo trì');
        }
    };
    useEffect(() => {
        getProduct(+id);
        window.scroll(0, 0);
    }, [id]);

    //  handle size, color
    const [color, setColor] = useState<string>('');
    const [size, setSize] = useState<string>('');

    const handleChangeSize = (event: { target: { value: SetStateAction<string> } }) => {
        setSize(event.target.value);
    };

    // handle handleAddCart
    const handleAddCart = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // call api day vao gio hang  style
            if (id) {
                const quantity: number = 1; // so luong san pham
                const productId: number = +id; //id san pham
                const valueNames: Array<string> = [color, size]; //style san pham
                try {
                    const resonse = await addToCart(quantity, productId, valueNames);
                    // handle số lượng sản phẩm trong giỏ hàng
                    getTotalItemOfCart();

                    // handle defaut value
                    setSize('');
                    setColor('');

                    if (resonse?.status === 201 && resonse?.data?.product?.name) {
                        toast.success('Đã thêm vào giỏ hàng');
                    } else {
                        toast.info(resonse.data.message);
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
    // handle price theo size và color
    const handleGetPrice = async () => {
        if (color && size) {
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
                toast.error(`${error}`);
            }
        }
    };

    const handleToggleFavorite = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setFavourite((prev) => !prev);
            try {
                await putFollowProduct(+id);
                const response = await getCountItemOfWishList();
                dispatch(setToTalWishList(+response.data));
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            toast.info('Bạn cần đăng nhập trước khi yêu thích sản phẩm');
            navigate(config.Routes.logIn);
        }
    };
    useEffect(() => {
        handleGetPrice();
    }, [id, color, size]);

    // handle số lượng sản phẩm trong giỏ hàng
    const getTotalItemOfCart = async () => {
        const totalProductInCart = await getCountItemOfCart();
        if (totalProductInCart.status === 200) {
            dispatch(setToTalProductCart(+totalProductInCart.data));
        }
    };

    // handle image
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [picColor, setPicColor] = useState<string>('');
    const images = product?.listImages || [];

    const handleNextClick = () => {
        setPicColor('');
        // Xử lý sự kiện khi người dùng bấm nút "Next"
        const newIndex = (currentImageIndex + 1) % images.length;
        setCurrentImageIndex(newIndex);
    };
    const handlePreviousClick = () => {
        setPicColor('');
        if (currentImageIndex === 0) {
            setCurrentImageIndex(images.length - 1); // Đặt lại thành chỉ số của ảnh cuối cùng
        } else {
            // Xử lý sự kiện khi người dùng bấm nút "Previous"
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };
    const handleChangePic = (index: number) => {
        setPicColor('');
        setCurrentImageIndex(index);
    };
    // handle change color imgColor
    const handleChangePicColor = (pic: { valueName: string; imageUrl: string }) => {
        setPicColor(pic.imageUrl);
        setColor(pic.valueName);
    };

    return (
        <div className="w-10/12 m-auto pt-32">
            <div className="grid grid-flow-row md:grid-flow-col grid-cols-12 gap-2">
                {/* Start list image product */}
                <div className=" hidden col-span-1 lg:flex flex-col gap-2 overflow-y-auto scroll-smooth hide-scrollbar h-144">
                    {images.map((item, index) => (
                        <img
                            src={item}
                            key={index}
                            alt={item}
                            className="w-full h-20 bg-contain rounded-md hover:opacity-40"
                            onMouseEnter={() => handleChangePic(index)}
                        />
                    ))}
                </div>
                {/* End list image product */}
                {/* Start image product */}
                <div className="col-span-12 md:col-span-6 relative flex gap-1">
                    <div
                        className="w-full h-144 bg-cover bg-no-repeat bg-center relative rounded-md border-2"
                        style={{ backgroundImage: picColor ? `url(${picColor})` : `url(${images[currentImageIndex]})` }}
                    >
                        <div className="w-full flex justify-end ">
                            <IconButton onClick={handlePreviousClick}>
                                <NavigateBefore className="bg-white rounded-full" sx={{ fontSize: 35 }} />
                            </IconButton>
                            <IconButton onClick={handleNextClick}>
                                <NavigateNext className="bg-white rounded-full" sx={{ fontSize: 35 }} />
                            </IconButton>
                        </div>
                    </div>
                </div>
                {/* End image product */}
                {/* Start info prođuct */}
                <div className="col-span-12 md:col-span-6 lg:col-span-5 md:ml-10 ">
                    <div className="text-xl not-italic font-medium">{product?.name}</div>
                    <div className="text-lg not-italic font-medium pt-5 text-red-500 flex">
                        <span className="text-sm pr-1">đ</span>
                        <span>{product?.price.toLocaleString('vi-VN')}</span>
                        <span className="text-gray-600 px-3">|</span>
                        <div>
                            <span className="text-lg text-gray-800 font-semibold pr-2">{product?.rating}/5</span>
                            <Rating readOnly value={ratingProduct} precision={0.01} sx={{ fontSize: '16px' }} />
                        </div>
                        <span className="text-gray-600 px-3">|</span>
                        <div>
                            <span className="text-lg text-gray-800 font-semibold">{product?.numberOfRatings}</span>
                            <span className="text-base text-gray-500 "> Đánh giá</span>
                        </div>
                    </div>

                    {/* start sỉze */}
                    <div className="mt-10 mb-2">
                        <span>Chọn Size</span>
                    </div>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">Kích cỡ</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            input={<OutlinedInput label="Kích cỡ" />}
                            fullWidth
                            value={size}
                            onChange={handleChangeSize}
                        >
                            {product?.options
                                .filter(
                                    (option) =>
                                        option.optionName.toLowerCase() === 'size' ||
                                        option.optionName.toLowerCase() === 'kích thước',
                                )
                                .flatMap((filteredOption) =>
                                    filteredOption.values.map((item, index) => (
                                        <MenuItem key={index} value={item.valueName}>
                                            {item.valueName}
                                        </MenuItem>
                                    )),
                                )}
                        </Select>
                    </FormControl>
                    {/* end sỉze */}
                    {/* start list color */}
                    <div className="mt-10">
                        <span>Chọn Màu</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-2 gap-2">
                        {product?.options
                            .filter(
                                (option) =>
                                    option.optionName.toLowerCase() === 'màu' ||
                                    option.optionName.toLowerCase() === 'color',
                            )
                            .flatMap((filteredOption) =>
                                filteredOption.values.map((item, index) => (
                                    <BootstrapButton key={index} onClick={() => handleChangePicColor(item)}>
                                        <Card sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <div className="flex justify-center items-center font-semibold text-center w-full text-sm h-18">
                                                {item.valueName}
                                            </div>
                                            <Image className="h-18" src={item.imageUrl} alt={item.valueName} />
                                        </Card>
                                    </BootstrapButton>
                                )),
                            )}
                    </div>

                    <div className="text-gray-500 text-sm w-full flex items-center justify-start mt-10">
                        {product?.quantityAvailable} sản phẩm có sẵn
                    </div>
                    {/* end list color */}
                    <div className="flex gap-2">
                        <Button
                            fullWidth
                            disabled={color && size ? false : true}
                            variant="contained"
                            sx={{ height: 50, marginTop: 2 }}
                            onClick={handleAddCart}
                        >
                            + <ShoppingCart />
                        </Button>
                        <Button
                            sx={{ height: 50, marginTop: 2, color: 'red', border: '1px solid red' }}
                            variant="outlined"
                            onClick={handleToggleFavorite}
                        >
                            {favourite ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder sx={{ color: 'red' }} />}
                        </Button>
                    </div>
                    <div className="pt-10">
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Giao hàng và vận chuyển</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Đơn hàng từ 5.000.000₫ trở lên của bạn sẽ được giao hàng tiêu chuẩn miễn phí.
                                    <br /> <br />
                                    Giao hàng tiêu chuẩn 4-5 ngày làm việc Chuyển phát nhanh 2-4 ngày làm việc Đơn hàng
                                    được xử lý và giao từ Thứ Hai đến Thứ Sáu (trừ ngày lễ)
                                    <br />
                                    <br />
                                    Thành viên Duck được hưởng lợi nhuận miễn phí.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
                {/* End info prođuct */}
            </div>
            {/* Start product description */}
            <div className="mt-5">
                <div className="bg-gray-200 p-3 rounded text-xl font-normal">MÔ TẢ SẢN PHẨM</div>
                <div className="mt-5 text-lg bg-gray-100 p-5 rounded shadow-md whitespace-pre-line">
                    {product?.description}
                </div>
            </div>

            {/* Start product reviews */}
            <div className="mt-5">
                <ReviewProductCurrent id={+id} rating={ratingProduct} />
            </div>

            {/* Start related product */}
            <div className="mt-5">
                <RelatedProduct categoryName={categoryName} />
            </div>
        </div>
    );
};

export default DetailProduct;
