/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const getCountItemOfWishList = async () => {
    try {
        const response = await axios.get(`/follows/wishlist/count`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getWishListWithPagination = async (pageNo: number, pageSize: number) => {
    try {
        const response = await axios.get(`/follows/wishlist?pageNo=${pageNo}&pageSize=${pageSize}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const putFollowProduct = async (productId: number) => {
    try {
        const response = await axios.put(`/follows?productId=${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
};
