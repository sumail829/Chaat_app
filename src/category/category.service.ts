import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Category)
        private categoryRepo:Repository<Category>,
    ){}

    async create(createDto:CreateCategoryDto): Promise<Category>{
        const category=this.categoryRepo.create(createDto);
        return this.categoryRepo.save(category);
    }

    async findAll():Promise<Category[]>{
        return this.categoryRepo.find();
    }

    async findOne(id:string):Promise<Category>{
        const category=await this.categoryRepo.findOne({where:{id}});
        if(!category) throw new NotFoundException('Category not found');
        return category;
    }

    async update(id:string,updateDto:UpdateCategoryDto):Promise<Category>{
        const category=await this.findOne(id);
        Object.assign(category,updateDto);
        return this.categoryRepo.save(category);
    }

    async remove(id:string):Promise<void>{
        const category=await this.findOne(id);
        await this.categoryRepo.remove(category);
    }
}

