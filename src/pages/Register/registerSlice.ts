import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../redux/store';
interface IInitialStateRegister {
    email: string;
    passWord: string;
}

const initialState: IInitialStateRegister = {
    email: '',
    passWord: '',
};

const saveEmailInStory = localStorage.getItem('emailRegister');
if (saveEmailInStory) {
    initialState.email = saveEmailInStory;
}

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setRegister: (state, action: PayloadAction<IInitialStateRegister>) => {
            state.email = action.payload.email;
            state.passWord = action.payload.passWord;

            localStorage.setItem('emailRegister', JSON.stringify(action.payload.email));
        },
        clearRegister: (state) => {
            state.email = '';
            state.passWord = '';
            localStorage.removeItem('emailRegister');
        },
    },
});

export const { setRegister, clearRegister } = registerSlice.actions;

export const getDataRegister = (state: RootState) => state.register;

export default registerSlice.reducer;
