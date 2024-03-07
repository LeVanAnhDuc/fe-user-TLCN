/* eslint-disable no-useless-catch */
import { IOrderCheckOut } from '../interface/order.js';
import axios from './axiosConfig.js';

export const searchOrderForUser = async (status: string) => {
    // try {
    //     const response = await axios.get(`/orders/search?status=${status}`);
    //     return response;
    // } catch (error) {
    //     throw error;
    // }
    try {
        const params: Record<string, string | number | boolean> = {};

        if (status) {
            params['status'] = status;
        }

        const url = '/orders/search?' + new URLSearchParams(params as Record<string, string>).toString();

        const response = await axios.get(url);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllOrderWithPagination = async (pageNo: number, pageSize: number) => {
    try {
        const response = await axios.get(`/orders?pageNo=${pageNo}&pageSize=${pageSize}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getHistoryOrderForCurrentUser = async () => {
    try {
        const response = await axios.get(`/orders/token`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCheckOutDataForPage = async () => {
    try {
        const response = await axios.get(`/orders/checkout-data`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOrderByID = async (idOrder: number) => {
    try {
        const response = await axios.get(`/orders/${idOrder}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getListOrderByUserName = async (userName: string) => {
    try {
        const response = await axios.get(`/orders/user?username=${userName}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getListOrderByUserID = async (idUserName: string) => {
    try {
        const response = await axios.get(`/orders/user/${idUserName}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addOrderByToken = async (data: IOrderCheckOut) => {
    try {
        const response = await axios.post('/orders', {
            total: data.total,
            paymentType: data.paymentType,
            note: data.note,
            addressId: data.addressId,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const makePaymentAgainByToken = async (orderId: number, data: IOrderCheckOut) => {
    try {
        const response = await axios.post(`/orders/pay-cod?orderId=${orderId}`, {
            total: data.total,
            note: data.note,
            addressId: data.addressId,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateOrderStatusByID = async (idOrder: number, status: string) => {
    try {
        const response = await axios.put(`/orders/${idOrder}/status?status=${status}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteOrderByUser = async (idOrder: string) => {
    try {
        const response = await axios.delete(`/orders/${idOrder}`);
        return response;
    } catch (error) {
        throw error;
    }
};
