import { TableStatus } from "./table-status.enum";
export declare class RestaurantTable {
    id: string;
    tableNumber: string;
    status: TableStatus;
    capacity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
