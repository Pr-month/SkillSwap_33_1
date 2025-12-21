import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Gender } from '../users.enums';
import { UserRole } from '../../auth/roles.enum';

export class UserResponseDto {
  @ApiProperty({
    example: '11111111-2222-3333-4444-555555555555',
    description: 'ID пользователя',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'Иван Иванов',
    description: 'Имя пользователя',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({
    example: 'Backend-разработчик из Москвы',
    description: 'Информация о пользователе',
    required: false,
  })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    description: 'Дата рождения пользователя в формате ISO',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Неверный формат даты рождения' })
  birthdate?: Date;

  @ApiProperty({
    example: 'Москва',
    description: 'Город проживания',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: Gender.MALE,
    description: 'Пол пользователя',
    enum: Gender,
    enumName: 'Gender',
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'gender должен быть одним из: MALE/FEMALE' })
  gender?: Gender;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL аватара пользователя',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL аватара' })
  avatar?: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'Роль пользователя в системе',
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole, { message: 'Недопустимая роль пользователя' })
  role: UserRole;
}
