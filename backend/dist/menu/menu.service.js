"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_entity_1 = require("./menu.entity");
const category_entity_1 = require("../category/category.entity");
let MenuService = class MenuService {
    menuRepo;
    categoryRepo;
    constructor(menuRepo, categoryRepo) {
        this.menuRepo = menuRepo;
        this.categoryRepo = categoryRepo;
    }
    async create(dto) {
        const category = await this.categoryRepo.findOne({
            where: { id: dto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const menu = this.menuRepo.create({
            ...dto,
            category,
        });
        return this.menuRepo.save(menu);
    }
    async findAll() {
        return this.menuRepo.find({
            relations: ['category'],
        });
    }
    async findByCategory(categoryId) {
        return this.menuRepo.find({
            where: { category: { id: categoryId } },
            relations: ['category'],
        });
    }
    async findOne(id) {
        const menu = await this.menuRepo.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        return menu;
    }
    async update(id, dto) {
        const menu = await this.findOne(id);
        if (dto.categoryId) {
            const category = await this.categoryRepo.findOne({
                where: { id: dto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
            menu.category = category;
        }
        Object.assign(menu, dto);
        return this.menuRepo.save(menu);
    }
    async remove(id) {
        const menu = await this.findOne(id);
        await this.menuRepo.remove(menu);
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map