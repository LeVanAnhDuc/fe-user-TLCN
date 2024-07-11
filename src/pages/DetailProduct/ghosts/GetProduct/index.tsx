// libs
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// types
import IProduct from '@/types/product';
// apis
import { getSingleProduct } from '@/apis/productApi';
// others
import config from '@/config';

const GetProduct = ({
    setProduct,
    setFavourite,
    setRatingProduct,
    setCategoryName,
    id,
    setQuantityAvailableItem,
    setImages,
}: {
    setProduct: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
    setFavourite: React.Dispatch<React.SetStateAction<boolean>>;
    setRatingProduct: React.Dispatch<React.SetStateAction<number>>;
    setCategoryName: React.Dispatch<React.SetStateAction<string>>;
    id?: string;
    setQuantityAvailableItem: React.Dispatch<React.SetStateAction<number>>;
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    const navigate = useNavigate();

    const getProduct = async (id: number) => {
        try {
            if (id && !isNaN(+id)) {
                const response = await getSingleProduct(id);

                if (response && response.data) {
                    setProduct(response.data);
                    setFavourite(response.data.liked);
                    setRatingProduct(response.data.rating);
                    setCategoryName(response.data.categoryName);
                    setQuantityAvailableItem(response.data.quantityAvailable);
                    setImages(response.data.listImages);
                }
                if (response.status !== 200) {
                    toast.error(response.data.message);
                    navigate(config.Routes.shop);
                }
            } else {
                navigate(config.Routes.shop);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        id && getProduct(+id);
    }, [id]);

    return null;
};

export default GetProduct;
