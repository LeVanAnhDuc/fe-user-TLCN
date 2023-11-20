import ShoppingCart from '@mui/icons-material/ShoppingCart';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';

import config from '../../config';
import IProduct from '../../interface/product';


const Card = (props: { itemProduct: IProduct }) => {
    const { itemProduct } = props;
    const navigate = useNavigate();

    // yeu thich
    const [favourite, setFavourite] = useState(false);
    const handleChangeFavorite = useCallback(() => {
        // call api yeu thich

        // fake
        setFavourite((prev) => !prev);
    }, [favourite]);
    // chi tiet san pham
    const handleNextDetailPage = () => {
        if (itemProduct.id) {
            navigate(`${config.Routes.detailProduct}#${itemProduct.id}`);
        } else {
            toast.error('Đang bảo trì');
        }
    };
    return (
        <div className="shadow-lg p-0 rounded-lg">
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
    );
};

export default Card;
