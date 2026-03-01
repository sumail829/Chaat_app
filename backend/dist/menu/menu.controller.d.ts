import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(dto: CreateMenuDto): Promise<import("./menu.entity").Menu>;
    findAll(): Promise<import("./menu.entity").Menu[]>;
    findByCategory(categoryId: string): Promise<import("./menu.entity").Menu[]>;
    findOne(id: string): Promise<import("./menu.entity").Menu>;
    update(id: string, dto: UpdateMenuDto): Promise<import("./menu.entity").Menu>;
    remove(id: string): Promise<void>;
}
