import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Express } from 'express';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../src/auth/roles.enum';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';
import { UpdatePasswordDto } from '../src/users/dto/update-password.dto';
import { AccessTokenGuard } from '../src/auth/guards/accessToken.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserResponseDto } from '../src/users/dto/get-user-response.dto';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: UserRole;
  };
}

// Утилита генерации уникального email
const generateEmail = (prefix: string = 'user') =>
  `${prefix}-${Date.now()}@example.com`;

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let server: Express;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<Request>();
          const userId = (req.headers['x-user-id'] as string) || 'test-user-id';
          const role = ((req.headers['x-user-role'] as string) ||
            UserRole.USER) as UserRole;
          (req as AuthenticatedRequest).user = {
            sub: userId,
            email: 'test@example.com',
            role,
          };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer() as Express;
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  // Утилита создания пользователя и возвращения его ID
  const createTestUser = async (
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
  ) => {
    const hash = await (await import('bcrypt')).hash(password, 10);
    const user = userRepository.create({ email, password: hash, role });
    const saved = await userRepository.save(user);
    return saved.id;
  };

  describe('Authenticated user flow', () => {
    let userId: string;
    let email: string;

    beforeEach(async () => {
      email = generateEmail('testuser');
      userId = await createTestUser(email, 'MyP@ssw0rd123');
    });

    it('GET /users/me should return current user', async () => {
      const res = await request(server)
        .get('/users/me')
        .set('X-User-Id', userId)
        .expect(200);

      const user = res.body as UserResponseDto;
      expect(user.id).toBe(userId);
      expect(user.email).toBe(email);
      expect(user.role).toBe(UserRole.USER);
      expect(user.name).toBeDefined();
    });

    it('PATCH /users/me should update user profile', async () => {
      const updateDto: UpdateUserDto = {
        name: 'Иван Иванов',
        city: 'Москва',
        about: 'Backend-разработчик',
      };

      const res = await request(server)
        .patch('/users/me')
        .set('X-User-Id', userId)
        .send(updateDto)
        .expect(200);

      const user = res.body as UserResponseDto;
      expect(user.name).toBe('Иван Иванов');
      expect(user.city).toBe('Москва');
      expect(user.about).toBe('Backend-разработчик');
    });

    it('PATCH /users/me/password should update password', async () => {
      const oldPassword = 'MyP@ssw0rd123';
      const newPassword = 'NewStr0ngP@ss!23';
      const user = await userRepository.findOneBy({ id: userId });
      user!.password = await (await import('bcrypt')).hash(oldPassword, 10);
      await userRepository.save(user!);

      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword,
        newPassword,
      };

      await request(server)
        .patch('/users/me/password')
        .set('X-User-Id', userId)
        .send(updatePasswordDto)
        .expect(200);

      const updatedUser = await userRepository.findOneBy({ id: userId });
      const isMatch = await (
        await import('bcrypt')
      ).compare(newPassword, updatedUser!.password);
      expect(isMatch).toBe(true);
    });

    it('GET /users should return list of users (for USER role)', async () => {
      const res = await request(server)
        .get('/users')
        .set('X-User-Id', userId)
        .expect(200);

      const users = res.body as UserResponseDto[];
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThanOrEqual(1);

      const currentUser = users.find((u) => u.id === userId);
      expect(currentUser).toBeDefined();
      if (currentUser) {
        expect(currentUser.id).toBe(userId);
        expect(currentUser.email).toBe(email);
        expect(currentUser.role).toBe(UserRole.USER);
      }
    });
  });

  describe('Admin-only routes', () => {
    let adminId: string;
    let regularUserId: string;
    let regularEmail: string;

    beforeEach(async () => {
      // Создаём админа
      const adminEmail = generateEmail('admin');
      adminId = await createTestUser(
        adminEmail,
        'AdminP@ss123',
        UserRole.ADMIN,
      );

      // Создаём обычного пользователя
      regularEmail = generateEmail('regular');
      const hash = await (await import('bcrypt')).hash('RegularP@ss123', 10);
      const user = userRepository.create({
        email: regularEmail,
        password: hash,
        role: UserRole.USER,
      });
      const saved = await userRepository.save(user);
      regularUserId = saved.id;
    });

    it('POST /users should create a new user (admin only)', async () => {
      const createUserDto: CreateUserDto = {
        email: generateEmail('created-by-admin'),
        password: 'CreatedPass123',
      };

      const res = await request(server)
        .post('/users')
        .set('X-User-Id', adminId)
        .set('X-User-Role', UserRole.ADMIN)
        .send(createUserDto)
        .expect(201);

      const user = res.body as UserResponseDto;
      expect(user.id).toBeDefined();
      expect(user.email).toBe(createUserDto.email);
    });

    it('GET /users/:id should return user by ID (admin only)', async () => {
      const res = await request(server)
        .get(`/users/${regularUserId}`)
        .set('X-User-Id', adminId)
        .set('X-User-Role', UserRole.ADMIN)
        .expect(200);

      const user = res.body as UserResponseDto;
      expect(user.id).toBe(regularUserId);
      expect(user.email).toBe(regularEmail);
    });

    it('PATCH /users/:id should update user by ID (admin only)', async () => {
      const updateDto: UpdateUserDto = { name: 'Админ обновил' };
      const res = await request(server)
        .patch(`/users/${regularUserId}`)
        .set('X-User-Id', adminId)
        .set('X-User-Role', UserRole.ADMIN)
        .send(updateDto)
        .expect(200);

      const user = res.body as UserResponseDto;
      expect(user.name).toBe('Админ обновил');
    });

    it('DELETE /users/:id should delete user (admin only)', async () => {
      await request(server)
        .delete(`/users/${regularUserId}`)
        .set('X-User-Id', adminId)
        .set('X-User-Role', UserRole.ADMIN)
        .expect(200);

      const user = await userRepository.findOneBy({ id: regularUserId });
      expect(user).toBeNull();
    });
  });

  describe('Validation errors', () => {
    let userId: string;

    beforeEach(async () => {
      const email = generateEmail('valuser');
      userId = await createTestUser(email, 'ValidPass123');
    });

    it('PATCH /users/me with empty body should return 400', async () => {
      await request(server)
        .patch('/users/me')
        .set('X-User-Id', userId)
        .send({})
        .expect(400);
    });

    it('PATCH /users/me/password with wrong old password should return 400', async () => {
      const user = await userRepository.findOneBy({ id: userId });
      user!.password = await (await import('bcrypt')).hash('ValidPass123', 10);
      await userRepository.save(user!);

      const dto: UpdatePasswordDto = {
        oldPassword: 'WrongOldPass',
        newPassword: 'NewPass123!',
      };
      await request(server)
        .patch('/users/me/password')
        .set('X-User-Id', userId)
        .send(dto)
        .expect(400);
    });

    it('PATCH /users/me/password with same password should return 400', async () => {
      const samePassword = 'SamePass123';
      const user = await userRepository.findOneBy({ id: userId });
      user!.password = await (await import('bcrypt')).hash(samePassword, 10);
      await userRepository.save(user!);

      const dto: UpdatePasswordDto = {
        oldPassword: samePassword,
        newPassword: samePassword,
      };
      await request(server)
        .patch('/users/me/password')
        .set('X-User-Id', userId)
        .send(dto)
        .expect(400);
    });
  });
});
