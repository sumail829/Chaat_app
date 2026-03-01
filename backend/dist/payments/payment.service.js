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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../orders/entities/order.entity");
const typeorm_2 = require("typeorm");
const payment_status_enum_1 = require("./payment-enum/payment-status.enum");
const order_status_enum_1 = require("../orders/order-status.enum");
const payment_entity_1 = require("./entities/payment.entity");
const table_entity_1 = require("../restaurant-table/table.entity");
const table_status_enum_1 = require("../restaurant-table/table-status.enum");
let PaymentService = class PaymentService {
    paymentRepo;
    orderRepo;
    tableRepo;
    dataSource;
    constructor(paymentRepo, orderRepo, tableRepo, dataSource) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
        this.tableRepo = tableRepo;
        this.dataSource = dataSource;
    }
    async completePayment(orderId, dto) {
        return this.dataSource.transaction(async (manager) => {
            const order = await manager
                .getRepository(order_entity_1.Order)
                .createQueryBuilder('order')
                .where('order.id = :orderId', { orderId })
                .setLock('pessimistic_write')
                .getOne();
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            const payment = await manager.getRepository(payment_entity_1.Payment).findOne({
                where: { order: { id: orderId } },
            });
            if (!payment)
                throw new common_1.BadRequestException('Payment record missing');
            const table = await manager.getRepository(table_entity_1.RestaurantTable).findOne({
                where: { id: order.tableId },
            });
            if (!table)
                throw new common_1.BadRequestException('Table not found');
            order.table = table;
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (payment.status === payment_status_enum_1.PaymentStatus.PAID)
                throw new common_1.BadRequestException('Payment already completed');
            if (Number(payment.amount) !== Number(order.totalAmount))
                throw new common_1.BadRequestException('Payment amount mismatch');
            payment.status = payment_status_enum_1.PaymentStatus.PAID;
            payment.method = dto.method;
            payment.completedBy = dto.completedBy ?? null;
            order.status = order_status_enum_1.OrderStatus.SERVED;
            table.status = table_status_enum_1.TableStatus.AVAILABLE;
            await manager.save(payment);
            await manager.save(order);
            await manager.save(table);
            return {
                message: 'Payment completed successfully',
                orderId: order.id,
                table: order.table.tableNumber,
            };
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(table_entity_1.RestaurantTable)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PaymentService);
//# sourceMappingURL=payment.service.js.map