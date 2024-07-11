// libs
import { useEffect } from 'react';
// types
import { actionProduct } from '@/types/product';
// apis
import { updateProductAnalysis } from '@/apis/productApi';

const ViewAnalysis = ({ id }: { id?: string }) => {
    useEffect(() => {
        const timer = setTimeout(async () => {
            const actionAddToCart: actionProduct = 'view';
            id && (await updateProductAnalysis(+id, actionAddToCart));
        }, 3000);

        return () => clearTimeout(timer);
    }, []);
    return null;
};

export default ViewAnalysis;
