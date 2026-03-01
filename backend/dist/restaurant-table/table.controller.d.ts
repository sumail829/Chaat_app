import { RestaurantTableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
export declare class TableController {
    private readonly tableService;
    constructor(tableService: RestaurantTableService);
    create(dto: CreateTableDto): Promise<import("./table.entity").RestaurantTable>;
    findAll(): Promise<import("./table.entity").RestaurantTable[]>;
    findAvailable(): Promise<import("./table.entity").RestaurantTable[]>;
    update(id: string, dto: UpdateTableDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").UpdateResult>;
}
