import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AppConfig } from './config/types';
import { AllExceptionFilter } from './common/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('APP_CONFIG');
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(appConfig?.port ?? 3000);
}

void bootstrap();
