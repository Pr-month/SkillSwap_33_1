import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TAuthResponse } from './types';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    refresh(req: TAuthResponse): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(dto: CreateUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: TAuthResponse): Promise<string | null>;
}
