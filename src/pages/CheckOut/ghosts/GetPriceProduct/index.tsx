// libs
import { useEffect } from 'react';
// types
import IProductCart from '@/types/productCart';

const GetPriceProduct = ({
    setTotalPrice,
    productsPurchase,
}: {
    setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
    productsPurchase: IProductCart[];
}) => {
    useEffect(() => {
        setTotalPrice(productsPurchase.reduce((sum, value) => sum + value.subTotal, 0));
    }, [productsPurchase]);

    return null;
};

export default GetPriceProduct;
