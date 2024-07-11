// libs
import { useEffect } from 'react';
// types
import IProduct from '@/types/product';
// apis
import { getProductsSelling } from '@/apis/productApi';

const GetProductsSelling = ({ setProducts }: { setProducts: React.Dispatch<React.SetStateAction<IProduct[]>> }) => {
    const getProducts = async () => {
        try {
            const response = await getProductsSelling();

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

export default GetProductsSelling;
