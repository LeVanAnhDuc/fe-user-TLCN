interface IProductChildrenCart {
    id: number;
    name: string;
    quantityAvailable: number;
}

export interface IValue {
    valueName: string;
    imageUrl: string;
}
export interface ISku {
    price: number;
    sku: string;
    skuId: number;
    optionValues: Array<IValue>;
}

export default interface productCart {
    cartId: number;
    id: number;
    imageUrl: string;
    price: number;
    product: IProductChildrenCart;
    quantity: number;
    sku: ISku;
    subTotal: number;
}
