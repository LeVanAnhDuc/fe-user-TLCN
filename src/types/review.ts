export interface IStarNumberOfProduct {
    all: number;
    fiveStar: number;
    fourStar: number;
    oneStar: number;
    threeStar: number;
    twoStar: number;
}

export interface IreviewOrder extends Pick<Ireview, 'content' | 'stars' | 'productId'> {
    itemId: number;
}

export default interface Ireview {
    id: number;
    content: string;
    stars: number;
    createdDate: string;
    user: {
        username: string;
        avatarUrl: string;
    };
    productId: number;
    orderId: number;
    sku: string;
}
