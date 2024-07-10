import IProduct from '../types/product';
import IProductCart, { IProductChildrenCart, ISku } from '../types/productCart';

export const initObjectProduct: IProduct = {
    id: '',
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    quantityAvailable: 0,
    categoryId: '',
    slug: '',
    promotionalPrice: '',
    sold: 0,
    rating: 0,
    numberOfRatings: 0,
    favoriteCount: 0,
    isActive: false,
    isSelling: false,
    createdDate: '',
    lastModifiedDate: '',
    createdBy: '',
    lastModifiedBy: '',
    liked: false,
    listImages: [],
    options: [],
};

export const initObjectProductCart: IProductCart = {
    hasReview: false,
    id: 0,
    orderId: 0,
    imageUrl: '',
    price: 0,
    product: {} as IProductChildrenCart,
    quantity: 0,
    sku: {} as ISku,
    subTotal: 0,
};

export const initObjectAddressGHN = {
    label: '',
    id: 0,
    code: '0',
};

export const MESS_ACCURACY = 'Tài khoản chưa được xác thực';
