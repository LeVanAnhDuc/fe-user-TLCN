/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const getProvincesAPI = async () => {
    try {
        const response = await axios.get('/province');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getDistrictsAPI = async (id: string | number) => {
    try {
        const response = await axios.get(`/district?province_id=${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getWardAPI = async (id: string | number) => {
    try {
        const response = await axios.get(`/ward?district_id=${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
