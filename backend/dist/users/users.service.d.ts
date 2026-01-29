import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponseDto } from './dto/get-user-response.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    private filterUser;
    private findUserById;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    refresh(userId: string, newRefreshToken: string | null): Promise<string | null>;
    findByEmail(email: string): Promise<User>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
}
