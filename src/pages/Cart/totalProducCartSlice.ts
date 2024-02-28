import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../redux/store';

interface IInitialState {
    total: number;
}

const initialState: IInitialState = {
    total: 0,
};
const saved = localStorage.getItem('totalProductInCart');

if (saved) {
    initialState.total = JSON.parse(saved);
}

export const totalProducCartSlice = createSlice({
    name: 'totalProductInCart',
    initialState,
    reducers: {
        setToTalProductCart: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
            localStorage.setItem('totalProductInCart', JSON.stringify(action.payload));
        },
    },
});

export const { setToTalProductCart } = totalProducCartSlice.actions;

export const selectToTalProductCart = (state: RootState) => state.totalProducCart.total;

export default totalProducCartSlice.reducer;
