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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Добавляем GET /users/me
  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@Req() req: { user: { sub: number } }) {
    const userId = req.user.sub;
    return this.usersService.getMe(userId);
  }

  // Добавляем PATCH /users/me
  @UseGuards(AccessTokenGuard)
  @Patch('me')
  updateMe(
    @Req() req: { user: { sub: number } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.updateMe(userId, updateUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me/password')
  updatePassword(
    @Req() req: { user: { sub: number } },
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }
}
