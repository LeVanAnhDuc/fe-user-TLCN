/* eslint-disable no-useless-catch */
import IAddress from '../types/address.js';
import axios from './axiosConfig.js';

export const getListAddressOffCurrentUser = async () => {
    try {
        const response = await axios.get('/address');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneAddressByAddressID = async (idAddress: number) => {
    try {
        const response = await axios.get(`/address/${idAddress}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addNewAddressForCurrentUser = async (object: IAddress) => {
    try {
        const response = await axios.post(`/address`, object);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateAddressByAddressID = async (idAddress: number, object: IAddress) => {
    try {
        const response = await axios.put(`/address/${idAddress}`, object);
        return response;
    } catch (error) {
        throw error;
    }
};

export const setDefaultAddress = async (idAddress: number) => {
    try {
        const response = await axios.put(`/address/${idAddress}/default`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteAddressByAddressID = async (idAddress: number) => {
    try {
        const response = await axios.delete(`/address/${idAddress}`);
        return response;
    } catch (error) {
        throw error;
    }
};
