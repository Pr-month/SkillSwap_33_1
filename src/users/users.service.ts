import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  create(createUserDto: CreateUserDto): UserResponseDto {
    const user = this.usersRepository.create(createUserDto);
    return this.filterUser(user);
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
    Object.assign(user, updateUserDto);
    return this.filterUser(user);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Пользователь с ID ${id} не существует`);
    }
    return true;
  }

  async refresh(userId: string, newRefreshToken: string) {
    await new Promise((r) => setTimeout(r, 500));
    return newRefreshToken;
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с email ${email} не существует`,
      );
    }
    return this.filterUser(user);
  }

  // TODO: Реализовать когда будет подключена БД
  updatePassword(userId: number, _updatePasswordDto: UpdatePasswordDto) {
    void _updatePasswordDto; // Заглушка
    return `This action updates password for user #${userId}`;
  }
}
