import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  getMe(userId: number) {
    return `This action returns current user #${userId}`;
  }

  updateMe(userId: number, updateUserDto: UpdateUserDto) {
    return `This action updates current user #${userId}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // TODO: Реализовать когда будет подключена БД
  updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    return `This action updates password for user #${userId}`;
  }
}
