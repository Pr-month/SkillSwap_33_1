import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { jwtConfig as jwtCnf } from '../config/jwt.config';
import { JwtConfig } from '../config/types';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TJwtPayload } from './types';
import { UserRole } from './roles.enum';

const mockUser = {
  id: '123',
  email: 'user@example.com',
  password: '$2b$10$hashedPassword',
  role: UserRole.USER,
};

const jwtTestConfig: JwtConfig = {
  secret: 'test-secret',
  expiresIn: '1h',
  refreshSecret: 'test-refresh-secret',
  refreshExpiresIn: '7d',
};

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: jwtCnf.KEY, useValue: jwtTestConfig },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return payload if user exists and password is valid', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'user@example.com',
        'password123',
      );

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(
        'user@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      );
      expect(result).toEqual({
        sub: '123',
        email: 'user@example.com',
        role: UserRole.USER,
      });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('user@example.com', 'wrong'),
      ).rejects.toThrow(new UnauthorizedException('Invalid email or password'));
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong', mockUser.password);
    });
  });

  describe('refresh', () => {
    it('should generate tokens and update refresh token in DB', async () => {
      const payload: TJwtPayload = {
        sub: '123',
        email: 'user@example.com',
        role: UserRole.USER,
      };

      const accessToken = 'new-access-token';
      const refreshToken = 'new-refresh-token';

      jwtServiceMock.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = await service.refresh(payload);

      expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(1, payload, {
        secret: jwtTestConfig.secret,
        expiresIn: jwtTestConfig.expiresIn,
      });
      expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(2, payload, {
        secret: jwtTestConfig.refreshSecret,
        expiresIn: jwtTestConfig.refreshExpiresIn,
      });

      expect(usersServiceMock.refresh).toHaveBeenCalledWith(
        '123',
        refreshToken,
      );
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('login', () => {
    it('should validate user, refresh tokens and return them', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      usersServiceMock.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const accessToken = 'access-from-login';
      const refreshToken = 'refresh-from-login';
      jwtServiceMock.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = await service.login(loginDto);

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(
        'user@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      );
      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);
      expect(usersServiceMock.refresh).toHaveBeenCalledWith(
        '123',
        refreshToken,
      );
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('register', () => {
    it('should create user and call login', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'securePass123',
      };

      const mockCreatedUser = {
        id: '456',
        email: createUserDto.email,
        password: createUserDto.password,
        role: UserRole.USER,
      };

      usersServiceMock.create.mockResolvedValue(undefined);
      usersServiceMock.findByEmail.mockResolvedValue(mockCreatedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const accessToken = 'a';
      const refreshToken = 'r';
      jwtServiceMock.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = await service.register(createUserDto);

      expect(usersServiceMock.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: createUserDto.password,
      });
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('logout', () => {
    it('should call usersService.refresh with null refresh token', () => {
      const mockResponse = { message: 'Logged out' };
      usersServiceMock.refresh.mockReturnValue(mockResponse);

      const result = service.logout('999');

      expect(usersServiceMock.refresh).toHaveBeenCalledWith('999', null);
      expect(result).toBe(mockResponse);
    });
  });
});
