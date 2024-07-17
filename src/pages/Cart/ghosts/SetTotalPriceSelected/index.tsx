// libs
import React, { useEffect } from 'react';
// types
import IProductCart from '@/types/productCart';

const SetTotalPriceSelected = ({
    productsSelect,
    setTotalPriceSelected,
}: {
    productsSelect: IProductCart[];
    setTotalPriceSelected: React.Dispatch<React.SetStateAction<number>>;
}) => {
    useEffect(() => {
        const priceSelected = productsSelect.reduce((sum, value) => sum + value.subTotal, 0);

        setTotalPriceSelected(priceSelected);
    }, [productsSelect]);

    return null;
};

export default SetTotalPriceSelected;
