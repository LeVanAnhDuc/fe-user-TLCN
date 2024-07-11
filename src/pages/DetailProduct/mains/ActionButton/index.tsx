// libs
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
// types
import { actionProduct } from '@/types/product';
// components
import Button from '@/components/Button';
// apis
import { updateProductAnalysis } from '@/apis/productApi';
import { addToCart, getCartByToken } from '@/apis/cartApi';
import { getCountItemOfWishList, putFollowProduct } from '@/apis/followProductApi';
// redux
import { setToTalWishList } from '@/pages/Profile/Wishlist/wishListSlice';
import { setItemsOfCart, setToTalPriceCart, setToTalProductCart } from '@/pages/Cart/cartSlice';
// others
import config from '@/config';

const ActionButton = ({
    id,
    color,
    size,
    quantityAvailableItem,
    quantity,
    favourite,
    setSize,
    setColor,
    setQuantity,
    setFavourite,
}: {
    id?: string;
    color: string;
    size: string;
    quantityAvailableItem: number;
    quantity: number;
    favourite: boolean;
    setSize: React.Dispatch<React.SetStateAction<string>>;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    setFavourite: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation('detailProduct');

    const handleAddCart = async () => {
        if (quantity > quantityAvailableItem) {
            toast.error(t('insufficientProduct'));
            return;
        }

        if (!localStorage.getItem('accessToken')) {
            toast.info(t('requireLogin'));
            navigate(config.Routes.logIn);
            return;
        }

        if (id) {
            const productId: number = +id;
            const valueNames: Array<string> = [color, size];
            try {
                const addToCartAPI = await addToCart(quantity, productId, valueNames);

                if (addToCartAPI?.status === 201 && addToCartAPI?.data?.product?.name) {
                    const actionAddToCart: actionProduct = 'add_cart';

                    const [itemOfCart] = await Promise.all([
                        getCartByToken(),
                        updateProductAnalysis(productId, actionAddToCart),
                    ]);

                    if (itemOfCart.status === 200) {
                        dispatch(setItemsOfCart(itemOfCart?.data?.cartItems));
                        dispatch(setToTalPriceCart(itemOfCart?.data?.totalPrice));
                        dispatch(setToTalProductCart(itemOfCart.data.totalItems));
                    }

                    setSize('');
                    setColor('');
                    setQuantity(1);
                } else {
                    toast.info(addToCartAPI.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleToggleFavorite = async () => {
        if (!localStorage.getItem('accessToken')) {
            toast.info(t('requireLogin'));
            navigate(config.Routes.logIn);
            return;
        }

        if (id) {
            setFavourite((prev) => !prev);
            try {
                await putFollowProduct(+id);
                const response = await getCountItemOfWishList();
                dispatch(setToTalWishList(+response.data));
            } catch (error) {
                console.log(`${error}`);
            }
        }
    };
    return (
        <div className="flex gap-2 items-center">
            <Button
                fullWidth
                disabled={color && size && quantityAvailableItem > 0 && quantity > 0 ? false : true}
                variant="fill"
                onClick={handleAddCart}
                className="uppercase"
            >
                {t('addToCart')}
            </Button>
            <Button
                variant={favourite ? 'fill' : 'outline'}
                className="!rounded-full !p-3 border-2"
                onClick={handleToggleFavorite}
            >
                {favourite ? <Favorite /> : <FavoriteBorder />}
            </Button>
        </div>
    );
};

export default ActionButton;
