import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { TAuthResponse } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить access/refresh токены' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Refresh токен в формате Bearer <token>',
    schema: {
      type: 'string',
      example:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwic3ViIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NjMyMzE4NiwiZXhwIjoxNzY2MzI2Nzg2fQ.Y_QXobmyFsjsgEjT-9sTLbe78em_gSgmHxvOzZt9ULk',
    },
  })
  @ApiResponse({ status: 201, description: 'Токены успешно обновлены' })
  @ApiResponse({
    status: 401,
    description: 'Неверный или просроченный refresh токен',
  })
  refresh(@Request() req: TAuthResponse) {
    const { user } = req;
    return this.authService.refresh(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешная аутентификация, выдача токенов',
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные регистрации' })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Выход пользователя (logout)' })
  @ApiResponse({ status: 200, description: 'Пользователь разлогинен' })
  logout(@Res() res: Response) {
    return res.status(200).json({});
  }
}
