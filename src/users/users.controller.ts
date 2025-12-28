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
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/roles.enum';
import { TAuthResponse } from 'src/auth/types';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get('me')
  @ApiOperation({ summary: 'Получить данные текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Текущий пользователь' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  getMe(@Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.usersService.findOne(userId);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Patch('me')
  @ApiOperation({ summary: 'Обновить данные текущего пользователя' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Данные пользователя обновлены' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  updateMe(@Req() req: TAuthResponse, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub;
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('Update data is required');
    }
    return this.usersService.update(userId, updateUserDto);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Patch('me/password')
  @ApiOperation({ summary: 'Сменить пароль текущего пользователя' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Пароль успешно изменён' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  updatePassword(
    @Req() req: TAuthResponse,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Создать пользователя (админ или системный сценарий)',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.ADMIN)
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
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
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
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
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
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён (не админ)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
