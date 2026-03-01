import { RestaurantTable } from "./table.entity";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { Repository } from "typeorm";
export declare class RestaurantTableService {
    private tableRepo;
    constructor(tableRepo: Repository<RestaurantTable>);
    create(dto: CreateTableDto): Promise<RestaurantTable>;
    findall(): Promise<RestaurantTable[]>;
    findAvailable(): Promise<RestaurantTable[]>;
    update(id: string, dto: UpdateTableDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").UpdateResult>;
}
