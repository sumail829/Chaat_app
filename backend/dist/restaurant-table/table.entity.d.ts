import { TableStatus } from "./table-status.enum";
export declare class RestaurantTable {
    id: string;
    tableNumber: string;
    status: TableStatus;
    capacity: number;
    currentOccupancy: number;
    isActive: boolean;
    qrCode?: string;
    createdAt: Date;
    updatedAt: Date;
}
