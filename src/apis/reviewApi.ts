/* eslint-disable no-useless-catch */
import { IreviewOrder } from '../types/review.js';
import axios from './axiosConfig.js';

export const addReview = async (object: IreviewOrder) => {
    try {
        const response = await axios.post(`/reviews`, {
            content: object.content,
            stars: object.stars, // số nguyễn từ 1 đến 5
            itemId: object.itemId,
            productId: object.productId,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllReviewWithPagination = async (
    idProduct: number,
    pageNo: number,
    pageSize: number,
    star?: number | null,
) => {
    try {
        const params: Record<string, string | number | undefined> = {
            pageNo: pageNo,
            pageSize: pageSize,
        };
        if (star && (star !== undefined || star !== null)) {
            params['star'] = star;
        }

        const url = `/reviews/${idProduct}?` + new URLSearchParams(params as Record<string, string>).toString();
        const response = await axios.get(url);

        return response;
    } catch (error) {
        throw error;
    }
};
