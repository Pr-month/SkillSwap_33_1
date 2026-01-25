/**
 * TODO [AuthController]:
 * Добавить @HttpCode(HttpStatus.OK) к эндпоинту /auth/refresh.
 * Сейчас: POST без явного кода → 201 Created.
 * Ожидается: 200 OK.
     
 * TODO [AuthService / RefreshTokenStrategy]:
 * Реализовать ротацию refresh-токена (возвращать новый токен при обновлении).
 * Сейчас: refresh-токен не меняется — это снижает безопасность.
 * Необходимо генерировать новый refresh-токен, сохранять его в БД,
 * а старый считать недействительным.
      
 * TODO [RefreshTokenStrategy]:
 * Проверять, что refresh-токен из заголовка совпадает с тем,
 * что хранится у пользователя.
 * Сейчас: logout обнуляет refreshToken в БД, но RefreshTokenGuard
 * не сверяет его — поэтому старый токен остаётся валидным.
 * Без этой проверки инвалидация после logout невозможна.
       
 * TODO [AuthService.logout]:
 * Убедиться, что refresh-токен действительно обнуляется в БД.
 * (Предполагается, что это уже делается, но без проверки в стратегии — бесполезно.)
 * 
    RolandSallaz
    3 days ago
    Это лучше в стратегии

*/

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Express } from 'express';
import { AllExceptionFilter } from 'src/common/all-exception.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let server: Express;

  const testUser = {
    email: 'test@example.com',
    password: 'StrongP@ssw0rd',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionFilter());
    server = app.getHttpServer() as Express;
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await app.init();
  });

  afterAll(async () => {
    await userRepository.delete({ email: testUser.email });
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.delete({ email: testUser.email });
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user and return tokens', async () => {
      const res = await request(server)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should not allow duplicate registration', async () => {
      await request(server).post('/auth/register').send(testUser).expect(201);

      await request(server).post('/auth/register').send(testUser).expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      await request(server).post('/auth/register').send(testUser).expect(201);
    });

    it('should login existing user and return tokens', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send(testUser)
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should reject invalid credentials', async () => {
      await request(server)
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrong' })
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeEach(async () => {
      await userRepository.delete({ email: testUser.email });
      await request(server).post('/auth/register').send(testUser).expect(201);

      const loginRes = await request(server)
        .post('/auth/login')
        .send(testUser)
        .expect(200);
      refreshToken = (loginRes.body as { refreshToken: string }).refreshToken;
    });

    it('should refresh tokens using valid refresh token', async () => {
      const res = await request(server)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');

      /**
       * TODO [AuthController]:
       * Добавить @HttpCode(HttpStatus.OK) к эндпоинту /auth/refresh.
       * Сейчас: POST без явного кода → 201 Created.
       * Ожидается: 200 OK.
       */

      /**
       * TODO [AuthService / RefreshTokenStrategy]:
       * Реализовать ротацию refresh-токена (возвращать новый токен при обновлении).
       * Сейчас: refresh-токен не меняется — это снижает безопасность.
       * Идея: генерировать новый refresh-токен, сохранять его в БД,
       * а старый считать недействительным.
       */
    });

    it('should reject invalid or missing refresh token', async () => {
      await request(server).post('/auth/refresh').expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    let accessToken: string;
    beforeEach(async () => {
      await request(server).post('/auth/register').send(testUser).expect(201);

      const loginRes = await request(server)
        .post('/auth/login')
        .send(testUser)
        .expect(200);

      accessToken = (loginRes.body as { accessToken: string }).accessToken;
    });

    it('should logout user', async () => {
      await request(server)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      /**
       * TODO [RefreshTokenStrategy]:
       * Проверять, что refresh-токен из заголовка совпадает с тем,
       * что хранится у пользователя.
       * Сейчас: logout обнуляет refreshToken в БД, но RefreshTokenGuard
       * не сверяет его — поэтому старый токен остаётся валидным.
       * Без этой проверки инвалидация после logout невозможна.
       */

      /**
      * TODO [AuthService.logout]:
      * Убедиться, что refresh-токен действительно обнуляется в БД.
      * (Предполагается, что это уже делается, но без проверки в стратегии — бесполезно.)
          RolandSallaz
          3 days ago
          Это лучше в стратегии
       */
    });

    it('should reject logout without access token', async () => {
      await request(server).post('/auth/logout').expect(401);
    });
  });
});
