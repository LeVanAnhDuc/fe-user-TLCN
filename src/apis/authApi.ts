/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const checkExpiredToken = async (token: string) => {
    try {
        const response = await axios.get(`auth/check-token?token=${token}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const registerApi = async (username: string, email: string, password: string) => {
    try {
        const response = await axios.post('/auth/signup', {
            username,
            email,
            password,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const loginApi = async (email: string, password: string) => {
    try {
        const response = await axios.post('/auth/signin', {
            usernameOrEmail: email,
            password,
        });
        if (response.data.jwt) {
            localStorage.setItem('accessToken', response.data.jwt.accessToken);
            localStorage.setItem('tokenType', response.data.jwt.tokenType);
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const verifyOTPRegister = async (email: string, otp: string) => {
    try {
        const response = await axios.post('/auth/otp/verify', {
            email,
            otp,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const sendOTPRegister = async (email: string) => {
    try {
        const response = await axios.post(`auth/otp/send?email=${email}`);
        return response;
    } catch (error) {
        throw error;
    }
};
