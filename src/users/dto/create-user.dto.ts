import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole, { message: 'Role must be admin, user, or moderator' })
  role: UserRole; // 👈 role is included here

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  createdAt: Date;
  
  @IsNotEmpty()
  updatedAt: Date;
}
