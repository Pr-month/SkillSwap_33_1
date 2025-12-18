import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private filterUser(user: User): Partial<User> {
    const { password, refreshToken, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.filterUser(user));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не существует`);
    }

    return this.filterUser(user);
  }

  update(id: string, updateUserDto: UpdateUserDto): User | undefined {
    const user = this.findOne(id);
    if (!user) return undefined;
    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  async refresh(userId: string, newRefreshToken: string) {
    await new Promise((r) => setTimeout(r, 500));
    return newRefreshToken;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }
  // TODO: Реализовать когда будет подключена БД
  updatePassword(userId: number, _updatePasswordDto: UpdatePasswordDto) {
    void _updatePasswordDto; // Заглушка
    return `This action updates password for user #${userId}`;
  }
}
