/* eslint-disable no-useless-catch */
export const checkOutVNPay = (orderId: number) => {
    try {
        const response = `http://localhost:8080/api/v1/vnpay/submit-order-v2?orderId=${orderId}`;
        return response;
    } catch (error) {
        throw error;
    }
};

export const makePaymentVNPay = (total: number, orderId: number, addressId: number, note?: string) => {
    try {
        const response = `http://localhost:8080/api/v1/vnpay/pay?amount=${total}&orderId=${orderId}&addressId=${addressId}&note=${note}`;

        return response;
    } catch (error) {
        throw error;
    }
};
