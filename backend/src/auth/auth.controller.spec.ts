import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TAuthResponse, TJwtPayload } from './types';
import { UserRole } from './roles.enum';

const authServiceMock = {
  login: jest.fn(),
  register: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with LoginDto and return tokens', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'pass123',
      };

      const mockResult = {
        access_token: 'access-token-123',
        refresh_token: 'refresh-token-456',
      };

      authServiceMock.login.mockResolvedValue(mockResult);

      const result = await controller.login(loginDto);

      expect(authServiceMock.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('register', () => {
    it('should call authService.register with CreateUserDto and return user', () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'securePass123',
      };

      const mockResult = {
        id: '1',
        email: 'newuser@example.com',
        role: UserRole.USER,
      };

      authServiceMock.register.mockReturnValue(mockResult);

      const result = controller.register(createUserDto);

      expect(authServiceMock.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('refresh', () => {
    it('should extract user from request and call authService.refresh', () => {
      const mockUser: TJwtPayload = {
        sub: '789',
        email: 'user@example.com',
        role: UserRole.USER,
      };

      const mockReq: TAuthResponse = { user: mockUser };

      const mockResult = {
        access_token: 'new-access-token-789',
      };

      authServiceMock.refresh.mockReturnValue(mockResult);

      const result = controller.refresh(mockReq);

      expect(authServiceMock.refresh).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockResult);
    });
  });

  describe('logout', () => {
    it('should extract user.sub from request and call authService.logout', () => {
      const mockUser: TJwtPayload = {
        sub: '101',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };

      const mockReq: TAuthResponse = { user: mockUser };

      const mockResult = { message: 'Successfully logged out' };

      authServiceMock.logout.mockReturnValue(mockResult);

      const result = controller.logout(mockReq);

      expect(authServiceMock.logout).toHaveBeenCalledWith('101');
      expect(result).toEqual(mockResult);
    });
  });
});
