/* eslint-disable no-useless-catch */
import { IUserInfo } from '../types/user.js';
import axios from './axiosConfig.js';

export const getAllUserWithPagination = async (pageNo: number, pageSize: number) => {
    try {
        const response = await axios.get(`/users?pageNo=${pageNo}&pageSize=${pageSize}`);
        return response;
    } catch (error) {
        throw error;
    }
};

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
export const changePassWordByToken = async (oldPassword: string, newPassword: string) => {
    try {
        const response = await axios.put(`/users/password/change`, {
            oldPassword,
            newPassword,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const forgotPassWord = async (email: string, newPassword: string) => {
    try {
        const response = await axios.put(`/users/password/forgot?email=${email}&new_pass=${newPassword}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateAccountProfileOfSignedinAccount = async (data: IUserInfo) => {
    try {
        const response = await axios.put(`/users/profile`, {
            username: data.username,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
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
