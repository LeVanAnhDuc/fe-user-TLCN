export default interface IAddress {
    id?: number;
    fullName: string;
    phoneNumber: string;
    city?: string;
    district?: string;
    ward?: string;
    orderDetails: string;
    isDefault?: boolean;
    userId?: number;
}

export interface IAddressGHN {
    id: number;
    label: string;
}
