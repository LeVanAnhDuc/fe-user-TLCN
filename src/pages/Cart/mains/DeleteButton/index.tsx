// libs
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
// types
import IProductCart from '@/types/productCart';
// components
import Button from '@/components/Button';
// apis

import { deleteCartItemByID } from '@/apis/cartItemApi';
// others

import { deleteNumberProductCart, selectProductsCart, setItemsOfCart } from '../../cartSlice';

const DeleteButton = ({ productsSelect }: { productsSelect: IProductCart[] }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('cart');
    const products: IProductCart[] = useSelector(selectProductsCart);

    const handleDeleteAllProduct = async () => {
        const productsInCart = products.filter((item1) => !productsSelect.some((item2) => item1.id === item2.id));

        await Promise.all([productsSelect.map(async (item) => await deleteCartItemByID(item.id))]);

        dispatch(setItemsOfCart(productsInCart));
        dispatch(deleteNumberProductCart(productsSelect.length));
    };

    return (
        <div
            className={`${
                productsSelect.length <= 0 ? 'hidden' : 'block'
            } fixed bottom-0 bg-white dark:bg-dark-600 w-full h-20 z-10`}
        >
            <div className="w-11/12 sm:w-10/12 m-auto flex items-center h-full">
                <Button
                    className={`${
                        productsSelect.length <= 0
                            ? ''
                            : '!bg-red-500 dark:!bg-red-600 border-2 border-red-500 dark:border-red-600'
                    }`}
                    variant="fill"
                    disabled={productsSelect.length <= 0}
                    onClick={handleDeleteAllProduct}
                >
                    {t('deleteSelected')}
                </Button>
            </div>
        </div>
    );
};

export default DeleteButton;
