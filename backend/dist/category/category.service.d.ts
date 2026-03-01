import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
export declare class CategoryService {
    private categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    create(createDto: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
}
