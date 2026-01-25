import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

   TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: () => {
    const pwd = process.env.DB_PASSWORD;
    console.log('DB_PASSWORD is', pwd, typeof pwd);
    console.log('DB USER is',process.env.DB_USERNAME);
    console.log('DB host is', process.env.DB_HOST);

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
  ],
})
export class AppModule {}
