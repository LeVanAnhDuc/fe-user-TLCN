export default interface ICategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    productNumber: number;
    createdBy: string;
    lastModifiedBy: string;
    createdDate: string;
    lastModifiedDate: string;
    parentId: number;
    parentName: string;
}

export interface ICategoryName {
    name: string;
}

export interface IUpdateCategory {
    name: string;
    description: string;
    parentName: string | null;
}
