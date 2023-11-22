import { SetStateAction, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import ShoppingCart from '@mui/icons-material/ShoppingCart';

import Rating from '@mui/material/Rating';

import { getSingleProduct } from '../../apis/productApi';
import IProduct from '../../interface/product';

import BootstrapButton from './BootstrapButton';
import config from '../../config';
import { addToCart, getCountOfItems } from '../../apis/cartApi';
import OutlinedInput from '@mui/material/OutlinedInput';
import Image from '../../components/Image';
import { useDispatch } from 'react-redux';
import { setToTalProductCart } from '../Cart/totalProducCartSlice';

const DetailProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // handle get id
    const location = useLocation();
    const idProduct = location.hash.substring(1);
    // handle data
    const [product, setProduct] = useState<IProduct>(); // Dữ liệu từ API

    const getProduct = async (id: number) => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                // tồn tai ma san pham và phải là số
                const response = await getSingleProduct(id);

                if (response && response.data) {
                    setProduct(response.data);
                }
                if (response.status !== 200) {
                    toast.error(response.data.message);
                    navigate(config.Routes.listProducts);
                }
            } else {
                navigate(config.Routes.listProducts);
            }
        } catch {
            toast.error('Đang bảo trì');
        }
    };
    useEffect(() => {
        getProduct(+idProduct);
    }, [idProduct]);

    //  handle size, color
    const [color, setColor] = useState<string>('');
    const [size, setSize] = useState<string>('');

    // const handleChangeSize = (event: { target: { value: SetStateAction<string> } }) => {
    //     setSize(event.target.value);
    // };

    // handle handleAddCart
    const handleAddCart = async () => {
        // call api day vao gio hang  style
        if (idProduct) {
            const quantity: number = 1; // so luong san pham
            const productId: number = +idProduct; //id san pham
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
    };
    // handle số lượng sản phẩm trong giỏ hàng
    const getTotalItemOfCart = async () => {
        const totalProductInCart = await getCountOfItems();
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
    // handle change size
    const handleChangeSize = (size: { valueName: string }) => {
        setSize(size.valueName);
    };

    return (
        <div className="w-[86%] m-auto pt-28">
            <div className="grid grid-flow-row md:grid-flow-col grid-cols-12 gap-2 white-bg p-5 m-auto rounded-md">
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
                <div className="col-span-12 md:col-span-5 relative flex gap-1">
                    <div
                        className="w-full h-128 bg-cover bg-no-repeat bg-center relative rounded-md border-2"
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
                <div className="col-span-12 md:col-span-6 lg:col-span-6 md:ml-10 ">
                    <div className="text-xl not-italic font-medium pb-8">{product?.name}</div>
                    <div className="text-base not-italic font-medium gray-bg price-aline">
                        <span className='detail-dong'>đ</span>
                        <span className='detail-price'>{product?.price}</span>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <span className='rating-value'>{product?.rating}</span>&nbsp;
                        <Rating defaultValue={product?.rating} precision={0.5} readOnly sx={{ fontSize: '1.2rem' }}/>
                    </div>

                    {/* start sỉze */}
                     {/* <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">Kích cỡ</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            input={<OutlinedInput label="Kích cỡ" />}
                            fullWidth
                            value={size}
                            onChange={handleChangeSize}
                        >
                            {product?.options[1].values.map((item, index) => (
                                <MenuItem key={index} value={item.valueName}>
                                    {item.valueName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                    {/* end sỉze */}
                    {/* start list color */}
                    <div className='gray-bg rounded mt-8 pl-2 pr-2 pt-1 pb-1'>
                        <div className="mt-4 ml-2">
                            <span>Kích cỡ</span>
                        </div>
                        <div className="grid grid-cols-auto sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-auto gap-2 mb-8">
                            {product?.options[1].values.map((item, index) => (
                                <BootstrapButton key={index} onClick={() => handleChangeSize(item)}
                                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                                >
                                    <Card key={index} 
                                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}
                                    >
                                        <Box sx={{
                                                display: 'flex', flexDirection: 'column', fontSize: '16px', 
                                                flex: '1 1 auto', height: '50px', maxWidth: 'fit-content'}}
                                        >
                                            <CardContent>{item.valueName}</CardContent>
                                        </Box>
                                    </Card>
                                </BootstrapButton>
                            ))}
                        </div>
                        <div className="mt-4 mb-2 ml-2">
                            <span>Màu sắc</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-2 gap-2 mb-8">
                            {product?.options[0].values.map((item, index) => (
                                <BootstrapButton key={index} onClick={() => handleChangePicColor(item)}>
                                    <Card
                                        key={index}
                                        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                    >
                                        <Image className="p-[4px] h-[50px]" src={item.imageUrl} alt={item.valueName} />
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flex: '1 1 auto',
                                            height: '50px', 
                                            maxWidth: 'fit-content', 
                                        }}>
                                            <CardContent>{item.valueName}</CardContent>
                                        </Box>
                                    </Card>
                                </BootstrapButton>
                            ))}
                        </div>
                    </div>
                    {/* end list color */}

                    <div className='grid grid-cols-2 gap-6'>
                        <Button
                            disabled={color && size ? false : true}
                            w-10
                            variant="contained"
                            sx={{ height: 50, marginTop: 2, marginLeft: '10px' }}
                            onClick={handleAddCart}
                        >
                            +<ShoppingCart />&nbsp;Thêm vào giỏ hàng
                        </Button>
                        {/* <Button
                            disabled={color && size ? false : true}
                            fullWidth
                            variant="contained"
                            sx={{ height: 50, marginTop: 2, backgroundColor: '#FF0000', '&:hover': { backgroundColor: '#CC0000' } }} 
                            onClick={handleAddCart}
                        >
                            Mua ngay
                        </Button> */}
                    </div>
                    <div className="pt-10">
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Delivery & Returns</Typography>
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
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Product Information</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{product?.description}</Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                            >
                                <Typography>Reviews (0)</Typography>
                            </AccordionSummary>
                            <AccordionDetails></AccordionDetails>
                        </Accordion>
                    </div>
                </div>
                {/* End info prođuct */}
            </div>
        </div>
    );
};

export default DetailProduct;
