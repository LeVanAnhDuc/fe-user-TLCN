import IAddress from './address';
import { IProductCheckout } from './product';
import IProductCart from './productCart';
export interface IOrderCheckOut {
    total?: number;
    paymentType: string; //(VNPay) OR (Cash on Delivery)
    note?: string;
    addressId: number;
    orderItems?: IProductCheckout[];
    subTotal?: number;
    shippingFee?: number;
}

export interface ITrackingDTO {
    id: number;
    time: string;
    status: string;
    description: string;
    orderId: number;
  }

export default interface IOrder {
    address: IAddress;
    createdDate: string;
    id: number;
    isPaidBefore: boolean;
    lastModifiedDate: string;
    note: string;
    orderItems: Array<IProductCart>;
    paymentType: string;
    status: string;
    total: number;
    totalItems: number;
    userId: number;
    shippingFee: number;
    trackingDTOs: ITrackingDTO[];
}


