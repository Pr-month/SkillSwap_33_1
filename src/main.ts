import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { AppConfig } from './config/types';
import { AllExceptionFilter } from './common/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('APP_CONFIG');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет поля без валидаторов
      forbidNonWhitelisted: true, // бросает 400, если прислали лишнее
      transform: true, // преобразует типы по DTO
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(appConfig?.port ?? 3000);
}

void bootstrap();
