import { CategoryService } from './category.service';
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createDto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    findAll(): Promise<import("./category.entity").Category[]>;
    findOne(id: string): Promise<import("./category.entity").Category>;
    update(id: string, updateDto: UpdateCategoryDto): Promise<import("./category.entity").Category>;
    remove(id: string): Promise<void>;
}
