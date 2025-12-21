import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { TAuthResponse } from 'src/auth/types';

//TODO: Нужны ли роли и валидации?
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Добавляем GET /users/me
  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.usersService.findOne(userId);
  }

  // Добавляем PATCH /users/me
  @UseGuards(AccessTokenGuard)
  @Patch('me')
  updateMe(@Req() req: TAuthResponse, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub;
    if (!updateUserDto) throw new BadRequestException('Update data undefined');
    console.log(userId);
    console.log(updateUserDto);
    return this.usersService.update(userId, updateUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //TODO: Реализовать обновление пароля
  @UseGuards(AccessTokenGuard)
  @Patch('me/password')
  updatePassword(
    @Req() req: { user: { sub: number } },
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
