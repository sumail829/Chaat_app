import { Category } from '../category/category.entity';
export declare class Menu {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
