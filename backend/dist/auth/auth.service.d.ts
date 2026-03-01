import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: number;
        email: string;
        name: string;
        phone?: string;
        role: import("../users/dto/create-user.dto").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        orders: import("../orders/entities/order.entity").Order[];
    }>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
