/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../auth/roles.enum';
import { users } from 'src/scripts/test/test_users';
import { cities } from 'src/scripts/test/test_cities';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((password: string) => {
    return Promise.resolve(`hashed_${password}`);
  }),
  compare: jest.fn().mockImplementation((password: string, hashed: string) => {
    return Promise.resolve(hashed === `hashed_${password}`);
  }),
  hashSync: jest.fn().mockImplementation((password: string) => {
    return `hashed_${password}`;
  }),
}));

const saltRounds = parseInt(process.env.HASH_SALT || '10', 10);

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return UserResponseDto', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'SecureP@ss123',
      };

      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      const newUser = {
        id: 'generated-id',
        ...createUserDto,
        password: hashedPassword,
        role: UserRole.USER,
        refreshToken: null,
        skills: [],
        favoriteSkills: [],
        name: undefined,
        about: undefined,
        birthdate: undefined,
        city: undefined,
        gender: undefined,
        avatar: undefined,
      };

      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'generated-id',
        email: createUserDto.email,
        name: undefined,
        about: undefined,
        birthdate: undefined,
        city: undefined,
        gender: undefined,
        avatar: undefined,
        role: UserRole.USER,
      });
    });
  });

  describe('findAll', () => {
    it('should return all users as UserResponseDto[]', async () => {
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toHaveLength(users.length);
      expect(result[0]).toEqual({
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        about: users[0].about,
        birthdate: users[0].birthdate,
        city: users[0].city.name,
        gender: users[0].gender,
        avatar: users[0].avatar?.trim() ?? null,
        role: users[0].role,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = users[0];

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(user.id);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: user.id });
      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        about: user.about,
        birthdate: user.birthdate,
        city: user.city.name,
        gender: user.gender,
        avatar: user.avatar?.trim() ?? null,
        role: user.role,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException('Пользователь с ID invalid-id не существует'),
      );
    });
  });

  describe('update', () => {
    it('should update user fields and return updated UserResponseDto', async () => {
      const user = users[0];
      const city = cities[2];
      mockUserRepository.findOneBy.mockResolvedValue(user);
      const updatedUser = { ...user, city };
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const updateDto: UpdateUserDto = {
        city: city.id,
        about: undefined,
      };
      const result = await service.update(user.id, updateDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: user.id });
      expect(repository.save).toHaveBeenCalledWith({
        ...user,
        city: { id: city.id },
      });
      expect(result.about).toBe(user.about);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.update('nonexistent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete user and return success message', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(users[0].id);
      expect(repository.delete).toHaveBeenCalledWith(users[0].id);
      expect(result).toEqual({ message: 'Пользователь успешно удалён' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('refresh', () => {
    it('should update refreshToken and return it', async () => {
      const user = users[1];
      const newToken = 'new-refresh-token';
      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOneBy.mockResolvedValue({
        ...user,
        refreshToken: newToken,
      } as User);

      const result = await service.refresh(user.id, newToken);

      expect(repository.update).toHaveBeenCalledWith(user.id, {
        refreshToken: newToken,
      });
      expect(result).toBe(newToken);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = users[2];
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findByEmail(user.email);

      expect(repository.findOneBy).toHaveBeenCalledWith({ email: user.email });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if email not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findByEmail('unknown@example.com')).rejects.toThrow(
        new NotFoundException(
          'Пользователь с email unknown@example.com не существует',
        ),
      );
    });
  });

  describe('updatePassword', () => {
    it('should update password if old is correct and new is different', async () => {
      const user = users[0];
      mockUserRepository.findOneBy.mockResolvedValue(user);
      const updateDto: UpdatePasswordDto = {
        oldPassword: '12345',
        newPassword: 'newSecurePass123',
      };

      const result = await service.updatePassword(user.id, updateDto);

      expect(await bcrypt.compare(updateDto.oldPassword, user.password)).toBe(
        true,
      );
      expect(await bcrypt.compare(updateDto.newPassword, user.password)).toBe(
        false,
      );

      const newHashedPassword = await bcrypt.hash(
        updateDto.newPassword,
        saltRounds,
      );
      expect(repository.update).toHaveBeenCalledWith(user.id, {
        password: newHashedPassword,
        refreshToken: null,
      });
      expect(result).toEqual({ message: 'Пароль успешно изменён' });
    });

    it('should throw BadRequestException if old password is wrong', async () => {
      const user = users[1];
      mockUserRepository.findOneBy.mockResolvedValue(user);
      await expect(
        service.updatePassword(user.id, {
          oldPassword: 'wrong',
          newPassword: 'newPass',
        }),
      ).rejects.toThrow(new BadRequestException('Неверный текущий пароль'));
    });

    it('should throw BadRequestException if new password equals current', async () => {
      const user = users[2];
      mockUserRepository.findOneBy.mockResolvedValue(user);
      await expect(
        service.updatePassword(user.id, {
          oldPassword: 'strong_password',
          newPassword: 'strong_password',
        }),
      ).rejects.toThrow(
        new BadRequestException('Новый пароль должен отличаться от текущего'),
      );
    });
  });
});
