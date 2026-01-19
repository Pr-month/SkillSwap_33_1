import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/get-user-response.dto';
import { UserRole } from '../auth/roles.enum';
import { TAuthResponse } from 'src/auth/types';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updatePassword: jest.fn(),
    refresh: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should call usersService.findOne with userId from request', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockReq: TAuthResponse = {
        user: {
          sub: userId,
          email: 'john@example.com',
          role: UserRole.USER,
        },
      };
      const mockUser: UserResponseDto = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        role: UserRole.USER,
      };

      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.getMe(mockReq);

      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateMe', () => {
    it('should throw BadRequestException if updateUserDto is empty', () => {
      const mockReq: TAuthResponse = {
        user: {
          sub: '123',
          email: 'test@example.com',
          role: UserRole.USER,
        },
      };
      const emptyDto: UpdateUserDto = {};

      expect(() => controller.updateMe(mockReq, emptyDto)).toThrow(
        new BadRequestException('Update data is required'),
      );
      expect(mockUserService.update).not.toHaveBeenCalled();
    });

    it('should call usersService.update with correct userId and dto', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockReq: TAuthResponse = {
        user: {
          sub: userId,
          email: 'jane@example.com',
          role: UserRole.USER,
        },
      };
      const dto: UpdateUserDto = { name: 'Jane Doe' };
      const updatedUser: UserResponseDto = {
        id: userId,
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: UserRole.USER,
      };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateMe(mockReq, dto);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('updatePassword', () => {
    it('should call usersService.updatePassword with correct userId and dto', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockReq: TAuthResponse = {
        user: {
          sub: userId,
          email: 'user@example.com',
          role: UserRole.USER,
        },
      };
      const dto: UpdatePasswordDto = {
        oldPassword: 'OldPass123!',
        newPassword: 'NewPass456@',
      };

      mockUserService.updatePassword.mockResolvedValue(undefined);

      await controller.updatePassword(mockReq, dto);

      expect(mockUserService.updatePassword).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('create', () => {
    it('should call usersService.create with createUserDto', async () => {
      const dto: CreateUserDto = {
        email: 'admin@example.com',
        password: 'SecurePass123!',
      };
      const createdUser: UserResponseDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: '',
        email: dto.email,
        role: UserRole.ADMIN,
      };

      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return all users from usersService.findAll', async () => {
      const users: UserResponseDto[] = [
        {
          id: '1',
          name: 'User1',
          email: 'u1@example.com',
          role: UserRole.USER,
        },
        {
          id: '2',
          name: 'User2',
          email: 'u2@example.com',
          role: UserRole.USER,
        },
      ];

      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne with id param', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const user: UserResponseDto = {
        id,
        name: 'Admin',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };

      mockUserService.findOne.mockResolvedValue(user);

      const result = await controller.findOne(id);

      expect(mockUserService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should call usersService.update with id and dto', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto: UpdateUserDto = { city: 'Berlin' };
      const updatedUser: UserResponseDto = {
        id,
        name: 'Admin',
        email: 'admin@example.com',
        city: 'Berlin',
        role: UserRole.ADMIN,
      };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(id, dto);

      expect(mockUserService.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      mockUserService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(mockUserService.remove).toHaveBeenCalledWith(id);
    });
  });
});
