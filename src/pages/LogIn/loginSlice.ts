import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../redux/store';
interface IInitialStateLogin {
    isLogin: boolean;
    idUser: string;
    userNameUser: string;
    nameUser: string;
    avatarUrl: string | null;
}

const initialState: IInitialStateLogin = {
    isLogin: false,
    idUser: '',
    userNameUser: '',
    nameUser: '',
    avatarUrl: '',
};

const savedIsLogin = localStorage.getItem('isLogin');
if (savedIsLogin) {
    initialState.isLogin = JSON.parse(savedIsLogin);
}

const savedInfoUser = localStorage.getItem('infoUser');
if (savedInfoUser) {
    const dataInfo = JSON.parse(savedInfoUser);
    initialState.idUser = dataInfo.idUser;
    initialState.userNameUser = dataInfo.userNameUser;
    initialState.nameUser = dataInfo.nameUser;
    initialState.avatarUrl = dataInfo.avatarUrl;
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
            localStorage.setItem('isLogin', JSON.stringify(action.payload));
        },
        setInfoUser: (
            state,
            action: PayloadAction<{ idUser: string; userNameUser: string; avatarUrl: string | null; nameUser: string }>,
        ) => {
            state.idUser = action.payload.idUser;
            state.userNameUser = action.payload.userNameUser;
            state.avatarUrl = action.payload.avatarUrl;
            state.nameUser = action.payload.nameUser;

            if (action.payload.idUser && action.payload.userNameUser) {
                localStorage.setItem(
                    'infoUser',
                    JSON.stringify({
                        userNameUser: action.payload.userNameUser,
                        idUser: action.payload.idUser,
                        avatarUrl: action.payload.avatarUrl,
                        nameUser: action.payload.nameUser,
                    }),
                );
            }
        },
        setAvatarUser: (state, action: PayloadAction<string | null>) => {
            state.avatarUrl = action.payload;

            localStorage.setItem(
                'infoUser',
                JSON.stringify({
                    userNameUser: state.userNameUser,
                    idUser: state.idUser,
                    avatarUrl: action.payload,
                    nameUser: state.nameUser,
                }),
            );
        },
        setNameUser: (state, action: PayloadAction<string>) => {
            state.nameUser = action.payload;

            localStorage.setItem(
                'infoUser',
                JSON.stringify({
                    userNameUser: state.userNameUser,
                    idUser: state.idUser,
                    avatarUrl: state.avatarUrl,
                    nameUser: action.payload,
                }),
            );
        },
    },
});

export const { setIsLogin, setNameUser, setInfoUser, setAvatarUser } = loginSlice.actions;

export const selectIsLogin = (state: RootState) => state.login.isLogin;
export const selectIDUser = (state: RootState) => state.login.idUser;
export const selectUserNameUser = (state: RootState) => state.login.userNameUser;
export const selectNameUser = (state: RootState) => state.login.nameUser;
export const selectAvatarUrl = (state: RootState) => state.login.avatarUrl;

export default loginSlice.reducer;
