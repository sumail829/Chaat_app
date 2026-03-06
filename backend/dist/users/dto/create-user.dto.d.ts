export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator"
}
export declare class CreateUserDto {
    email: string;
    name: string;
    password: string;
    Confirmpassword: string;
    role: UserRole;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
