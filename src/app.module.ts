import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import configuration from './configuration';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import * as dotenv from 'dotenv';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        DB_PORT: Joi.number(),
        DB_HOST: Joi.string().ip(),
        // DB_URL: Joi.string().domain(),
        DB: Joi.string().valid('mysql', 'postgres'),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => {
        return {
          type: configService.get(ConfigEnum.DB),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Logs, Roles],
          // 同步本地的schema与数据库 -> 初始化的时候使用
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          logging: ['error'],
          // logging: true,
        };
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                },
              }
            : {
                target: 'pino-roll',
                options: {
                  file: join('logs', 'log.txt'),
                  frequenency: 'daily',
                  mkdir: true,
                  // 多大滚动一次
                  size: '10m',
                },
              },
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
