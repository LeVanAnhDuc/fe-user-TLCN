export default interface IAddress {
    id?: number;
    fullName: string;
    phoneNumber: string;
    district?: string;
    ward?: string;
    orderDetails: string;
    isDefault?: boolean;
    userId?: number;
    province?: string;
    provinceId?: number;
    districtId?: number;
    wardCode?: string;
}

export interface IAddressGHN {
    id: number;
    label: string;
    code: string;
}
