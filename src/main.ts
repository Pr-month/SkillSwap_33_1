import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { doubleCsrfProtection } from './csrf/csrf';
import { Request, Response, NextFunction } from 'express';

import { AppModule } from './app.module';
import { AppConfig } from './config/types';
import { AllExceptionFilter } from './common/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('APP_CONFIG');

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  // Применяем CSRF защиту ко всем путям, кроме Swagger
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      req.path === '/api' ||
      req.path.startsWith('/api/docs') ||
      req.path.startsWith('/api-json')
    ) {
      return next();
    }
    doubleCsrfProtection(req, res, next);
  });

  app.use(doubleCsrfProtection);

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      if (req.csrfToken && typeof req.csrfToken === 'function') {
        res.setHeader('X-CSRF-Token', req.csrfToken());
      }
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет поля без валидаторов
      forbidNonWhitelisted: true, // бросает 400, если прислали лишнее
      transform: true, // преобразует типы по DTO
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('SkillSwap API')
    .setDescription(
      `
    API для проекта SkillSwap.
    
    ## CSRF Защита:
    1. Сначала получите CSRF токен через GET /csrf
    2. Отправляйте его в заголовке X-CSRF-Token для всех не-GET запросов
    3. Куки будут отправляться автоматически (нужен credentials: 'include' на фронтенде)
  `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-CSRF-Token',
        in: 'header',
        description: 'CSRF токен для защиты от межсайтовых запросов',
      },
      'csrf-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api-json',
  });
  await app.listen(appConfig?.port ?? 3000);
}

void bootstrap();
