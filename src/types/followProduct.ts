import IProduct from './product';

export default interface IFollowProduct {
    id: number;
    userId: number;
    isDeleted: boolean;
    product: Pick<IProduct, 'name' | 'price'> & { imageUrl: string; productId: number };
}
