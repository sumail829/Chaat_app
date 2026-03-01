import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { Category } from '../category/category.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenuService {
    private menuRepo;
    private categoryRepo;
    constructor(menuRepo: Repository<Menu>, categoryRepo: Repository<Category>);
    create(dto: CreateMenuDto): Promise<Menu>;
    findAll(): Promise<Menu[]>;
    findByCategory(categoryId: string): Promise<Menu[]>;
    findOne(id: string): Promise<Menu>;
    update(id: string, dto: UpdateMenuDto): Promise<Menu>;
    remove(id: string): Promise<void>;
}
