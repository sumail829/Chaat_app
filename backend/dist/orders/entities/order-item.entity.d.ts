import { Order } from './order.entity';
import { Menu } from '../../menu/menu.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    menu: Menu;
    quantity: number;
    priceAtOrderTime: number;
    subtotal: number;
}
