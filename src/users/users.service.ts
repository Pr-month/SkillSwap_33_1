import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './users.enums';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@test.com',
      password: '$2b$10$hc6hOxMc0k9ib05yH2lL9.iKXgLHZ1nabXfveRG9YqQYoBZ5vQ6R2',
      name: 'Admin',
      role: UserRole.USER,
      skills: [],
    },
  ];

  create(createUserDto: CreateUserDto): User {
    // const newUser = {
    //   id: this.users.length + 1,
    //   ...createUserDto,
    //   password: '$2b$10$hc6hOxMc0k9ib05yH2lL9.iKXgLHZ1nabXfveRG9YqQYoBZ5vQ6R2',
    // } as User;
    // this.users.push(newUser);

    //TODO перевести на работу с БД
    console.log(`createUserDto ${JSON.stringify(createUserDto)}`);
    return this.users[0];
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
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
