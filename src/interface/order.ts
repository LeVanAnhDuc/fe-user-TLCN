import IAddress from './address';
import IProductCart from './productCart';
export interface IOrderCheckOut {
    total: number;
    paymentType: string; //(VNPay) OR (Cash on Delivery)
    note: string;
    addressId: number;
}

export default interface IOrder {
    address: IAddress;
    createdDate: string;
    id: number;
    isPaidBefore: boolean;
    lastModifiedDate: string;
    note: string;
    orderItems: IProductCart;
    paymentType: string;
    status: string;
    total: number;
    totalItems: number;
    userId: number;
}
