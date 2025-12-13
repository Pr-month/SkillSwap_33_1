import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: '1',
      email: 'admin@test.com',
      password: '$2b$10$4LJzDd1ww7cTOuA7UIb7r.HxtgopgFBJf0RRON9b6rUcl.1AOnVW6',
      name: 'Admin',
    },
  ];

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }
}
