import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../redux/store';

interface IInitialState {
    total: number;
}

const initialState: IInitialState = {
    total: 0,
};
const saved = localStorage.getItem('totalWishList');

if (saved) {
    initialState.total = JSON.parse(saved);
}

export const wishListSlice = createSlice({
    name: 'totalWishList',
    initialState,
    reducers: {
        setToTalWishList: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
            localStorage.setItem('totalWishList', JSON.stringify(state.total));
        },
    },
});

export const { setToTalWishList } = wishListSlice.actions;

export const selectToTalWishList = (state: RootState) => state.wishListSlice.total;

export default wishListSlice.reducer;
