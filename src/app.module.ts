import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { dbConfig } from './config/db.config';
import { appConfig } from './config/app.config';
import { type DbConfig } from './config/types';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [dbConfig.KEY],
      useFactory: (cfg: DbConfig) => cfg,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
