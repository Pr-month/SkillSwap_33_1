import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { dbConfig } from './config/db.config';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { envValidationSchema } from './config/env.validation';
import { type JwtConfig, type DbConfig } from './config/types';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SkillsModule } from './skills/skills.module';
import { FilesModule } from './files/files.module';
import { RequestsModule } from './requests/requests.module';
import { CategoriesModule } from './categories/categories.module';
import { CitiesModule } from './cities/cities.module';
import { GlossariesModule } from './glossaries/glossaries.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SkillsModule,
    CategoriesModule,
    CitiesModule,
    GlossariesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, dbConfig],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
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
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
