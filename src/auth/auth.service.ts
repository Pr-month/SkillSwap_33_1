import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConfig as jwtCnf } from '../config/jwt.config';
import { JwtConfig } from '../config/types';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';

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

  //Заменить на тип TJwtPayload при готовности
  async refresh(user: { sub: string }) {
    const { accessToken, refreshToken } = this.generateTokens(user);
    await this.usersService.refresh(user.sub, refreshToken);
    return { accessToken, refreshToken };
  }

  login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }
    return null;
  }

  async register(dto: CreateAuthDto) {
    //TODO добавить await после перехода на БД
    const existing = this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
    const hash = await bcrypt.hash(dto.password, 10);
    //TODO добавить await после перехода на БД
    const user = this.usersService.create({
      ...dto,
      password: hash,
    });
    return this.login(user);
  }
}
