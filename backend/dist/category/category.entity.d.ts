import { Menu } from '../menu/menu.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    menus: Menu[];
}
