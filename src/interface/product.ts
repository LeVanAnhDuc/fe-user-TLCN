export interface IValue {
    valueId: number;
    valueName: string;
    imageUrl: string;
}
export interface IOption {
    optionId: number;
    optionName: string;
    values: Array<IValue>;
}
export default interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    quantityAvailable: number;
    categoryId: string;
    slug: string;
    promotionalPrice: string;
    sold: number;
    rating: number;
    numberOfRatings: number;
    favoriteCount: number;
    isActive: boolean;
    isSelling: boolean;
    createdDate: string;
    lastModifiedDate: string;
    createdBy: string;
    lastModifiedBy: string;
    liked: boolean;
    listImages: Array<string>;
    options: Array<IOption>;
}

export interface IProductPriceBySKU {
    productId: number;
    valueNames: Array<string>;
}

export interface IProductFilter {
    pageNo: number;
    pageSize: number;
    key: string;
    cate: string;
    sort: string;
}
