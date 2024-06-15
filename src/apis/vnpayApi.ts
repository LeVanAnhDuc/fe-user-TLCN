/* eslint-disable no-useless-catch */
// const baseURL = 'http://52.195.234.114:5000/api/v1';
const baseURL = 'http:localhost:5000/api/v1';

export const checkOutVNPay = (orderId: number) => {
    try {
        const response = `${baseURL}/vnpay/submit-order-v2?orderId=${orderId}`;
        return response;
    } catch (error) {
        throw error;
    }
};

export const makePaymentVNPay = (total: number, orderId: number, addressId: number, note?: string) => {
    try {
        const response = `${baseURL}/vnpay/pay?amount=${total}&orderId=${orderId}&addressId=${addressId}&note=${note}`;
        return response;
    } catch (error) {
        throw error;
    }
};
