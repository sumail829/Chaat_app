import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    create(dto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string, withPassword?: boolean): Promise<User | null>;
    update(id: number, dto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<User>;
}
