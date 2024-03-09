import { configureStore } from '@reduxjs/toolkit';
import loginSlice from '../pages/LogIn/loginSlice';
import registerSlice from '../pages/Register/registerSlice';
import totalProductInCartSlice from '../pages/Cart/cartSlice';
import wishListSlice from '../pages/Profile/Wishlist/wishListSlice';
import themeSlice from '../components/SpeedDialSettingUI/themeSlice';

const store = configureStore({
    reducer: {
        login: loginSlice,
        register: registerSlice,
        cart: totalProductInCartSlice,
        wishList: wishListSlice,
        theme: themeSlice,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
