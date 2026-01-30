import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

   TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: () => {
    const pwd = process.env.DB_PASSWORD;

    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: pwd,  
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    };
  },
}),
    UsersModule,
    CategoryModule,
    AuthModule,
  ],
})
export class AppModule {}
