// libs
import { useEffect } from 'react';
// types
import IProductCart from '@/types/productCart';
// apis
import { getSKU } from '@/apis/productApi';

const GetLimitQuantitySKU = ({
    products,
    setProductsQuantityFull,
    setErrorAPI,
}: {
    products: IProductCart[];
    setProductsQuantityFull: React.Dispatch<
        React.SetStateAction<
            {
                id: number;
                quantityAvailable: number;
            }[]
        >
    >;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    useEffect(() => {
        try {
            const fetchProductQuantities = async () => {
                const promises = products.map(async (item) => {
                    const response = await getSKU(
                        item.product.id,
                        item.sku.optionValues[0].valueName,
                        item.sku.optionValues[1].valueName,
                    );

                    setProductsQuantityFull((prev) => [
                        ...prev,
                        { id: item.id, quantityAvailable: response.data.quantityAvailable },
                    ]);
                });

                await Promise.all(promises);
            };

            fetchProductQuantities();
        } catch (error) {
            setErrorAPI(true);
        }
    }, []);

    return null;
};

export default GetLimitQuantitySKU;
