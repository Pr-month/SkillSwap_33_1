import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../config/types';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { TJwtPayload } from './types';
export declare class AuthService {
    private jwtService;
    private readonly jwtConfig;
    private usersService;
    constructor(jwtService: JwtService, jwtConfig: JwtConfig, usersService: UsersService);
    private generateTokens;
    refresh(user: TJwtPayload): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginData: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateUser(email: string, password: string): Promise<TJwtPayload>;
    register(dto: CreateUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<string | null>;
}
