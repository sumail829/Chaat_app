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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const typeorm_2 = require("typeorm");
const order_item_entity_1 = require("./entities/order-item.entity");
const table_entity_1 = require("../restaurant-table/table.entity");
const menu_entity_1 = require("../menu/menu.entity");
const table_status_enum_1 = require("../restaurant-table/table-status.enum");
const payment_entity_1 = require("../payments/entities/payment.entity");
const payment_status_enum_1 = require("../payments/payment-enum/payment-status.enum");
const order_status_enum_1 = require("./order-status.enum");
let OrdersService = class OrdersService {
    orderRepo;
    orderItemRepo;
    tableRepo;
    menuRepo;
    paymentRepo;
    constructor(orderRepo, orderItemRepo, tableRepo, menuRepo, paymentRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.tableRepo = tableRepo;
        this.menuRepo = menuRepo;
        this.paymentRepo = paymentRepo;
    }
    async createOrder(user, tableId) {
        const table = await this.tableRepo.findOne({
            where: { id: tableId, status: table_status_enum_1.TableStatus.AVAILABLE },
        });
        if (!table) {
            throw new common_1.BadRequestException('Table not available');
        }
        table.status = table_status_enum_1.TableStatus.OCCUPIED;
        await this.tableRepo.save(table);
        const order = this.orderRepo.create({
            user,
            table,
            totalAmount: 0,
            status: order_status_enum_1.OrderStatus.PENDING,
        });
        const savedOrder = await this.orderRepo.save(order);
        return savedOrder;
    }
    async addItems(orderId, dto) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['items', 'payment'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        let totalToAdd = 0;
        const orderItems = [];
        for (const entry of dto.items) {
            const menu = await this.menuRepo.findOne({
                where: { id: entry.menuId, isAvailable: true },
            });
            if (!menu) {
                throw new common_1.NotFoundException(`Menu item ${entry.menuId} not available`);
            }
            const subtotal = menu.price * entry.quantity;
            const item = this.orderItemRepo.create({
                order,
                menu,
                quantity: entry.quantity,
                priceAtOrderTime: menu.price,
                subtotal,
            });
            totalToAdd += subtotal;
            orderItems.push(item);
        }
        await this.orderItemRepo.save(orderItems);
        order.totalAmount = order.totalAmount + totalToAdd;
        await this.orderRepo.save(order);
        let payment = order.payment;
        if (!payment) {
            payment = this.paymentRepo.create({
                orderId: order.id,
                amount: order.totalAmount,
                status: payment_status_enum_1.PaymentStatus.PENDING,
            });
        }
        else {
            payment.amount = order.totalAmount;
        }
        await this.paymentRepo.save(payment);
        return {
            message: 'Items added successfully',
            addedItems: orderItems,
            newTotalAmount: order.totalAmount,
            paymentId: payment.id,
            paymentStatus: payment.status,
        };
    }
    async findAllorders() {
        return this.orderRepo.find({ relations: ['items', 'payment', 'table', 'user'] });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(table_entity_1.RestaurantTable)),
    __param(3, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __param(4, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map