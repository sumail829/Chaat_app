import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // CREATE USER
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      phone: dto.phone,
      isActive: dto.isActive,
      role: dto.role ?? UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.userRepo.save(user);
  }

  // FIND ALL USERS
  findAll() {
    return this.userRepo.find();
  }


  // FIND ONE BY ID
  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // FIND BY EMAIL (for Auth)
  async findByEmail(email: string, withPassword = false) {
    return this.userRepo.findOne({
      where: { email },
      select: withPassword
        ? ['id', 'email', 'password', 'role']
        : ['id', 'email', 'role'],
    });
  }

  // UPDATE USER
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  // DELETE USER
  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}
