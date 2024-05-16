/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const getFeeShipping = async (to_district_id: number, to_ward_code: string) => {
    try {
        const response = await axios.post('v2/shipping-order/fee', {
            from_district_id: 3695,
            from_ward_code: '90742',
            to_district_id,
            to_ward_code,
            service_type_id: 2,
            weight: 7000,
        });
        return response;
    } catch (error) {
        throw error;
    }
};
