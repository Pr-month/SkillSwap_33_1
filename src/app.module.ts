import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { dbConfig } from './config/db.config';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { type JwtConfig, type DbConfig } from './config/types';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SkillsModule } from './skills/skills.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SkillsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, dbConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),

        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        JWT_SECRET: Joi.string().min(8).required(),
        JWT_EXPIRES_IN: Joi.string().default('1h'),
        JWT_REFRESH_SECRET: Joi.string().min(8).required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

        HASH_SALT: Joi.number().default(10),
      }),

      validationOptions: {
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [dbConfig.KEY],
      useFactory: (cfg: DbConfig) => cfg,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [jwtConfig.KEY],
      useFactory: (cfg: JwtConfig) => ({
        secret: cfg.secret,
        signOptions: { expiresIn: cfg.expiresIn },
      }),
    }),
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
