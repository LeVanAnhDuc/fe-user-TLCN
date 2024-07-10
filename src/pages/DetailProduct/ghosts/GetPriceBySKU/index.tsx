// libs
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import IProduct from '@/types/product';
// apis
import { getSKUPrice } from '@/apis/productApi';

const GetPriceBySKU = ({
    color,
    size,
    id,
    product,
    setProduct,
    setQuantityAvailableItem,
}: {
    color: string;
    size: string;
    id?: string;
    product?: IProduct;
    setProduct: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
    setQuantityAvailableItem: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const handleGetPrice = async () => {
        if (color && size && id) {
            try {
                const response = await getSKUPrice(+id, color, size);
                if (response.status === 200 && product) {
                    setProduct({
                        ...product,
                        price: response.data.price as number,
                        originalPrice: response.data.originalPrice as number,
                    });
                    setQuantityAvailableItem(response.data.quantityAvailable);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                console.log(`${error}`);
            }
        }
    };

    useEffect(() => {
        handleGetPrice();
    }, [color, size]);

    return null;
};

export default GetPriceBySKU;
