/* eslint-disable no-useless-catch */
import { IInfoProfileUser } from '../interface/user.js';
import axios from './axiosConfig.js';

export const getSingleUserByID = async (idUser: string) => {
    try {
        const response = await axios.get(`/users/id/${idUser}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserByUserNameOrEmail = async (userNameOrEmail: string) => {
    try {
        const response = await axios.get(`/users/${userNameOrEmail}`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const changePassWordByToken = async (passWord: string) => {
    try {
        const response = await axios.put(`/users/password/change?newPassword=${passWord}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const forgotPassWord = async (email: string, newPassword: string) => {
    try {
        const response = await axios.put(`/users/password/forgot?email=${email}&newPassword=${newPassword}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateAccountProfileOfSignedinAccount = async (data: IInfoProfileUser) => {
    try {
        const response = await axios.put(`/users/profile`, {
            username: data.username,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            avatarUrl: data.avatarUrl,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateAccountProfileByIDUser = async (userID: string) => {
    try {
        const response = await axios.put(`/users/profile/${userID}`);
        return response;
    } catch (error) {
        throw error;
    }
};
