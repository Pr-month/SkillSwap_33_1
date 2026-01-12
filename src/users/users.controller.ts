import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TAuthResponse } from 'src/auth/types';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
  ApiCreateUser,
  ApiFindAllUsers,
  ApiFindOne,
  ApiGetMe,
  ApiPatchMe,
  ApiRemoveUser,
  ApiUpdatePassword,
  ApiUpdateUser,
} from './users.swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get('me')
  @ApiGetMe()
  getMe(@Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.usersService.findOne(userId);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Patch('me')
  @ApiPatchMe()
  updateMe(@Req() req: TAuthResponse, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub;
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('Update data is required');
    }
    return this.usersService.update(userId, updateUserDto);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Patch('me/password')
  @ApiUpdatePassword()
  updatePassword(
    @Req() req: TAuthResponse,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiCreateUser()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get()
  @ApiFindAllUsers()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiFindOne()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiUpdateUser()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiRemoveUser()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
