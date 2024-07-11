/* eslint-disable no-useless-catch */
import axios from './axiosConfig.js';

export const getFeeShipping = async (to_district_id: number, to_ward_code: string, weight: number) => {
    // Kiểm tra nếu to_district_id là 1463 hoặc 3695
    const districtIDs = [3715, 3713, 3695, 2090, 1534, 1533, 1463, 1462, 1461, 1460, 1459, 1458, 1457, 1456, 1455, 1454, 1453, 1452, 1451, 1450, 1449, 1448, 1447, 1446, 1444, 1443, 1442];

    if (districtIDs.includes(to_district_id)) {
        to_ward_code = '510709';
    }
    try {
        const response = await axios.post('v2/shipping-order/fee', {
            from_district_id: 1463,
            //from_ward_code: '21805',
            to_district_id,
            to_ward_code,
            service_type_id: 2,
            weight,
            height: 20,
            length: 30,
            width: 40
        });

        return response;
    } catch (error) {
        throw error;
    }
};
