import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../redux/store';

interface IInitialStateSpeedDial {
    theme: string;
}

const initialState: IInitialStateSpeedDial = {
    theme: 'light',
};
const savedIsTheme = localStorage.getItem('theme');
if (savedIsTheme) {
    initialState.theme = savedIsTheme;
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setIsTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
    },
});

export const { setIsTheme } = themeSlice.actions;

export const selectIsTheme = (state: RootState) => state.theme.theme;

export default themeSlice.reducer;
