/* eslint-disable no-useless-catch */
// typs
import { IProductFilter, actionProduct } from '../types/product.js';
// apis
import axios from './axiosConfig.js';

export const getAllProductSearchWithinPagination = async (productSearch: IProductFilter) => {
    try {
        const params: Record<string, string | number | boolean> = {
            sell: true,
            pageNo: productSearch.pageNo,
            pageSize: productSearch.pageSize,
        };

        if (productSearch.key !== '') {
            params['key'] = productSearch.key;
        }

        if (productSearch.sort !== '') {
            params['sort'] = productSearch.sort;
        }

        if (productSearch.cate !== '') {
            params['cate'] = productSearch.cate;
        }

        const url = '/products/search?' + new URLSearchParams(params as Record<string, string>).toString();

        const response = await axios.get(url);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getSKU = async (productId: number, color: string, size: string) => {
    try {
        const response = await axios.get(`/products/sku?product_id=${productId}&value_names=${color},${size}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllProductWithinPagination = async (pageNo: number, pageSize: number) => {
    try {
        const response = await axios.get(`/products?pageNo=${pageNo}&pageSize=${pageSize}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getSingleProduct = async (id: number) => {
    try {
        const response = await axios.get(`/products/${id}`);

        return response;
    } catch (error) {
        throw error;
    }
};

export const updateProductAnalysis = async (product_id: number, type: actionProduct) => {
    try {
        const params: Record<string, string | number> = {};

        if (product_id !== undefined) {
            params['product_id'] = product_id;
        }

        if (type !== undefined) {
            params['type'] = type;
        }

        const url = '/products/analyze?' + new URLSearchParams(params as Record<string, string>).toString();

        const response = await axios.post(url);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getProductsHot = async () => {
    try {
        const params: Record<string, string | number | boolean> = {
            sell: true,
            pageNo: 1,
            pageSize: 7,
            sort: 'random',
        };

        const url = '/products/search?' + new URLSearchParams(params as Record<string, string>).toString();

        const response = await axios.get(url);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getProductsSelling = async () => {
    try {
        const params: Record<string, string | number | boolean> = {
            sell: true,
            pageNo: 2,
            pageSize: 7,
            sort: 'random',
        };

        const url = '/products/search?' + new URLSearchParams(params as Record<string, string>).toString();

        const response = await axios.get(url);

        return response;
    } catch (error) {
        throw error;
    }
};

export const getProductsFavorite = async () => {
    try {
        const params: Record<string, string | number | boolean> = {
            sell: true,
            pageNo: 3,
            pageSize: 7,
            sort: 'random',
        };

        const url = '/products/search?' + new URLSearchParams(params as Record<string, string>).toString();

        const response = await axios.get(url);

        return response;
    } catch (error) {
        throw error;
    }
};
