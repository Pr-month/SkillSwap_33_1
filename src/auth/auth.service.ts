import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConfig as jwtCnf } from 'src/config/jwt.config';
import { JwtConfig } from 'src/config/types';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { TJwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtCnf.KEY) private readonly jwtConfig: JwtConfig,
    private usersService: UsersService,
  ) {}

  private generateTokens(payload: any) {
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
    const { accessToken, refreshToken } = this.generateTokens(user);
    await this.usersService.refresh(user.sub, refreshToken);
    return { accessToken, refreshToken };
  }

  async login(loginData: LoginDto) {
    const user = await this.validateUser(loginData.email, loginData.password);
    const { accessToken, refreshToken } = await this.refresh({
      sub: user.id,
      role: user.role,
      email: user.email,
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async register(dto: CreateAuthDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hash,
    });
    return this.login(user);
  }
}
