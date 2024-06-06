/* eslint-disable no-useless-catch */
// const baseURL = 'http://ec2-18-183-254-95.ap-northeast-1.compute.amazonaws.com:5000/api/v1';
const baseURL = 'http:localhost:5000/api/v1';

export const checkOutVNPay = (orderId: number) => {
    try {
        // const response = `http://localhost:8080/api/v1/vnpay/submit-order-v2?orderId=${orderId}`;
        const response = `http:localhost:5000/api/v1/vnpay/submit-order-v2?orderId=${orderId}`;
        return response;
    } catch (error) {
        throw error;
    }
};

export const makePaymentVNPay = (total: number, orderId: number, addressId: number, note?: string) => {
    try {
        // const response = `http://localhost:8080/api/v1/vnpay/pay?amount=${total}&orderId=${orderId}&addressId=${addressId}&note=${note}`;
        const response = `${baseURL}/vnpay/pay?amount=${total}&orderId=${orderId}&addressId=${addressId}&note=${note}`;

        return response;
    } catch (error) {
        throw error;
    }
};


