import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { TAuthResponse } from 'src/auth/types';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Добавляем GET /users/me
  @UseGuards(AccessTokenGuard)
  @Get('me')
  @ApiOperation({ summary: 'Получить данные текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Текущий пользователь' })
  getMe(@Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.usersService.findOne(userId);
  }

  // Добавляем PATCH /users/me
  @UseGuards(AccessTokenGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Обновить данные текущего пользователя' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Данные пользователя обновлены' })
  updateMe(@Req() req: TAuthResponse, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub;
    return this.usersService.update(userId, updateUserDto);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать пользователя (админ или системный сценарий)',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID пользователя',
    example: '11111111-2222-3333-4444-555555555555',
  })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me/password')
  @ApiOperation({ summary: 'Сменить пароль текущего пользователя' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Пароль успешно изменён' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  updatePassword(
    @Req() req: { user: { sub: number } },
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя по id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID пользователя',
    example: '11111111-2222-3333-4444-555555555555',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Пользователь обновлён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID пользователя',
    example: '11111111-2222-3333-4444-555555555555',
  })
  @ApiResponse({ status: 200, description: 'Пользователь удалён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
