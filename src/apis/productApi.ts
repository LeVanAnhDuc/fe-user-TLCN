/* eslint-disable no-useless-catch */
import { IProductFilter } from '../interface/product.js';
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

export const getSKUPrice = async (productId: number, color: string, size: string) => {
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
