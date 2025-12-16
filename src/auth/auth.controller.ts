import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(@Request() req: Request & { user: { sub: string } }) {
    const { user } = req;
    return this.authService.refresh(user);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    return this.authService.login(user);
  }
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    return res.status(200).json({});
  }
}
