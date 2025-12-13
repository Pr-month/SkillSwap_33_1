import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: [
        'id',
        'name',
        'email',
        'about',
        'birthdate',
        'city',
        'gender',
        'avatar',
        'skills',
        'wantToLearn',
        'favoriteSkills',
        'role',
      ],
    });
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
