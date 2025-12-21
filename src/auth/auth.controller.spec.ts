import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { jwtConfig as jwtCnf } from '../config/jwt.config';

describe('AuthController', () => {
  let controller: AuthController;

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('token'),
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    refresh: jest.fn(),
  };

  const jwtTestConfig = {
    secret: 'test-secret',
    expiresIn: '1h',
    refreshSecret: 'test-refresh-secret',
    refreshExpiresIn: '7d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: jwtCnf.KEY, useValue: jwtTestConfig },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
