import { TAuthResponse } from 'src/auth/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: TAuthResponse): Promise<import("./dto/get-user-response.dto").UserResponseDto>;
    updateMe(req: TAuthResponse, updateUserDto: UpdateUserDto): Promise<import("./dto/get-user-response.dto").UserResponseDto>;
    updatePassword(req: TAuthResponse, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<import("./dto/get-user-response.dto").UserResponseDto>;
    findAll(): Promise<import("./dto/get-user-response.dto").UserResponseDto[]>;
    findOne(id: string): Promise<import("./dto/get-user-response.dto").UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./dto/get-user-response.dto").UserResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
