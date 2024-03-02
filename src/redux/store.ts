// redux toolket
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from '../pages/LogIn/loginSlice';
import registerSlice from '../pages/Register/registerSlice';
import totalProductInCartSlice from '../pages/Cart/totalProductInCartSlice';
import wishListSlice from '../pages/Profile/Wishlist/wishListSlice';

const store = configureStore({
    reducer: {
        login: loginSlice,
        register: registerSlice,
        totalProductInCart: totalProductInCartSlice,
        wishListSlice: wishListSlice,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
