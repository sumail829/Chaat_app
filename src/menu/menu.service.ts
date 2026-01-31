import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { Category } from '../category/category.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateMenuDto): Promise<Menu> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const menu = this.menuRepo.create({
      ...dto,
      category,
    });

    return this.menuRepo.save(menu);
  }

  async findAll(): Promise<Menu[]> {
    return this.menuRepo.find({
      relations: ['category'],
    });
  }

  async findByCategory(categoryId: string): Promise<Menu[]> {
    return this.menuRepo.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
    });
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async update(id: string, dto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);
    Object.assign(menu, dto);
    return this.menuRepo.save(menu);
  }

  async remove(id: string): Promise<void> {
    const menu = await this.findOne(id);
    await this.menuRepo.remove(menu);
  }
}
