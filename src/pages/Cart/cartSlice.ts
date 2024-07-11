import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../redux/store';
import IProductCart from '../../types/productCart';

interface IInitialState {
    totalItem: number;
    totalPrice: number;
    listItemInCart: IProductCart[];
    listItemPurchaseInCart: IProductCart[];
}

const initialState: IInitialState = {
    totalItem: 0,
    totalPrice: 0,
    listItemInCart: [],
    listItemPurchaseInCart: [],
};

const saveTotal = localStorage.getItem('totalProductInCart');
if (saveTotal) {
    initialState.totalItem = JSON.parse(saveTotal);
}

const saveListItemOfCart = localStorage.getItem('productInCart');
if (saveListItemOfCart) {
    initialState.listItemInCart = JSON.parse(saveListItemOfCart);
}

const savePrice = localStorage.getItem('totalPriceInCart');
if (savePrice) {
    initialState.totalPrice = JSON.parse(savePrice);
}

const saveListItemPurchaseInCart = localStorage.getItem('productPurchaseInCart');
if (saveListItemPurchaseInCart) {
    initialState.listItemPurchaseInCart = JSON.parse(saveListItemPurchaseInCart);
}

export const totalProductInCartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setToTalProductCart: (state, action: PayloadAction<number>) => {
            state.totalItem = action.payload;
            localStorage.setItem('totalProductInCart', JSON.stringify(state.totalItem));
        },
        deleteNumberProductCart: (state, action: PayloadAction<number>) => {
            state.totalItem -= action.payload;
            localStorage.setItem('totalProductInCart', JSON.stringify(state.totalItem));
        },
        setItemsOfCart: (state, action: PayloadAction<IProductCart[]>) => {
            state.listItemInCart = action.payload;
            localStorage.setItem('productInCart', JSON.stringify(state.listItemInCart));
        },
        setToTalPriceCart: (state, action: PayloadAction<number>) => {
            state.totalPrice = action.payload;
            localStorage.setItem('totalPriceInCart', JSON.stringify(state.totalPrice));
        },
        setProductsPurchase: (state, action: PayloadAction<IProductCart[]>) => {
            state.listItemPurchaseInCart = action.payload;
            localStorage.setItem('productPurchaseInCart', JSON.stringify(state.listItemPurchaseInCart));
        },
    },
});

export const { setToTalProductCart, deleteNumberProductCart, setItemsOfCart, setToTalPriceCart, setProductsPurchase } =
    totalProductInCartSlice.actions;

export const selectToTalProductCart = (state: RootState) => state.cart.totalItem;
export const selectToTalPriceCart = (state: RootState) => state.cart.totalPrice;
export const selectProductsCart = (state: RootState) => state.cart.listItemInCart;
export const selectProductsPurchaseCart = (state: RootState) => state.cart.listItemPurchaseInCart;

export default totalProductInCartSlice.reducer;
