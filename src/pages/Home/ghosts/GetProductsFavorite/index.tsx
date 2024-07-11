// libs
import { useEffect } from 'react';
// types
import IProduct from '@/types/product';
// apis
import { getProductsFavorite } from '@/apis/productApi';

const GetProductsFavorite = ({ setProducts }: { setProducts: React.Dispatch<React.SetStateAction<IProduct[]>> }) => {
    const getProducts = async () => {
        try {
            const response = await getProductsFavorite();

            if (response.status === 200) {
                const { content } = response.data;

                setProducts(content);
            }
        } catch (error) {
            //
        }
    };
    useEffect(() => {
        getProducts();
    }, []);

    return null;
};

export default GetProductsFavorite;
