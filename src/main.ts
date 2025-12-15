import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { AppConfig } from './config/types';
import { AllExceptionFilter } from './common/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('APP_CONFIG');
  app.useGlobalFilters(new AllExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(appConfig?.port ?? 3000);
}

void bootstrap();
