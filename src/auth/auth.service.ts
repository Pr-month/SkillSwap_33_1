import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConfig as jwtCnf } from '../config/jwt.config';
import { JwtConfig } from '../config/types';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { TJwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtCnf.KEY) private readonly jwtConfig: JwtConfig,
    private usersService: UsersService,
  ) {}

  private generateTokens(payload: TJwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.secret,
      expiresIn: this.jwtConfig.expiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async refresh(user: TJwtPayload) {
    const { accessToken, refreshToken } = this.generateTokens({
      sub: user.sub,
      email: user.email,
      role: user.role,
    });
    await this.usersService.refresh(user.sub, refreshToken);
    return { accessToken, refreshToken };
  }

  async login(loginData: LoginDto) {
    const user = await this.validateUser(loginData.email, loginData.password);
    const { accessToken, refreshToken } = await this.refresh({
      sub: user.sub,
      role: user.role,
      email: user.email,
    });
    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<TJwtPayload> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async register(dto: CreateUserDto) {
    await this.usersService.create({
      ...dto,
    });
    return this.login(dto);
  }

  logout(userId: string) {
    return this.usersService.refresh(userId, null);
  }
}
