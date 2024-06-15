/* eslint-disable no-useless-catch */
const baseURL = import.meta.env.VITE_BASE_URL;

export const checkOutVNPay = (orderId: number) => {
    return `${baseURL}/vnpay/submit-order-v2?orderId=${orderId}`;
};

export const makePaymentVNPay = (total: number, orderId: number, addressId: number, note?: string) => {
    return `${baseURL}/vnpay/pay?amount=${total}&orderId=${orderId}&addressId=${addressId}&note=${note}`;
};
