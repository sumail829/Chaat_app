import { CreateTableDto } from "./create-table.dto";
import { TableStatus } from "../table-status.enum";
declare const UpdateTableDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTableDto>>;
export declare class UpdateTableDto extends UpdateTableDto_base {
    status?: TableStatus;
}
export {};
