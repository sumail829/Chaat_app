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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantTable = void 0;
const typeorm_1 = require("typeorm");
const table_status_enum_1 = require("./table-status.enum");
let RestaurantTable = class RestaurantTable {
    id;
    tableNumber;
    status;
    capacity;
    isActive;
    qrCode;
    createdAt;
    updatedAt;
};
exports.RestaurantTable = RestaurantTable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RestaurantTable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], RestaurantTable.prototype, "tableNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: table_status_enum_1.TableStatus,
        default: table_status_enum_1.TableStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], RestaurantTable.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], RestaurantTable.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RestaurantTable.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RestaurantTable.prototype, "qrCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RestaurantTable.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RestaurantTable.prototype, "updatedAt", void 0);
exports.RestaurantTable = RestaurantTable = __decorate([
    (0, typeorm_1.Entity)('restaurant_tables')
], RestaurantTable);
//# sourceMappingURL=table.entity.js.map