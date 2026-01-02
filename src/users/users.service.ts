import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponseDto } from './dto/get-user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private filterUser(user: User): UserResponseDto {
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      about: user.about,
      birthdate: user.birthdate,
      city: user.city,
      gender: user.gender,
      avatar: user.avatar,
      role: user.role,
    };
    return userResponse;
  }

  private async findUserById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не существует`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hash,
    });
    const saved = await this.usersRepository.save(user);
    return this.filterUser(saved);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.filterUser(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    return this.filterUser(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findUserById(id);

    // забираем только ключи, реально пришедшие в запросе (не undefined)
    const patch = Object.fromEntries(
      Object.entries(updateUserDto).filter(([, v]) => v !== undefined),
    );

    const saved = await this.usersRepository.save({ ...user, ...patch });
    return this.filterUser(saved);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Пользователь с ID ${id} не существует`);
    }
    return { message: 'Пользователь успешно удалён' };
  }

  async refresh(userId: string, newRefreshToken: string) {
    await this.usersRepository.update(userId, {
      refreshToken: newRefreshToken,
    });

    const updatedUser = await this.findUserById(userId);
    return updatedUser.refreshToken;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с email ${email} не существует`,
      );
    }
    return user;
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findUserById(userId);

    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    const isSamePassword = await bcrypt.compare(
      updatePasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'Новый пароль должен отличаться от текущего',
      );
    }

    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    await this.usersRepository.update(userId, {
      password: hashedPassword,
      refreshToken: null,
    });

    return {
      message: 'Пароль успешно изменён',
    };
  }
}
