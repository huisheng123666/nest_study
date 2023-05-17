import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
// import configuration from './configuration';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { connectionParams } from '../ormconfig';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        DB_PORT: Joi.number(),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        // DB_URL: Joi.string().domain(),
        DB: Joi.string().valid('mysql', 'postgres'),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        LOG_ON: Joi.boolean(),
        LOG_LEVEL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport:
    //       process.env.NODE_ENV !== 'development'
    //         ? {
    //             target: 'pino-pretty',
    //             options: {
    //               colorize: true,
    //             },
    //           }
    //         : {
    //             target: 'pino-roll',
    //             options: {
    //               file: join('logs', 'log.txt'),
    //               frequenency: 'daily',
    //               mkdir: true,
    //               // 多大滚动一次
    //               size: '10m',
    //             },
    //           },
    //   },
    // }),
    UserModule,
    LogsModule,
    RolesModule,
  ],
  controllers: [],
})
export class AppModule {}
