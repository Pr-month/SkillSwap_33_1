import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../users.enums';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Иван Иванов',
    description: 'Имя пользователя (2–50 символов)',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'Ваше имя должно быть от 2 до 50 символов' })
  name?: string;

  @ApiProperty({
    example: 'Backend-разработчик из Москвы',
    description: 'Информация о пользователе (до 1000 символов)',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000, {
    message: 'Информация о себе не должна превышать 1000 символов',
  })
  about?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Дата рождения в формате ISO (YYYY-MM-DD)',
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
  @IsUrl()
  avatar?: string;
}
