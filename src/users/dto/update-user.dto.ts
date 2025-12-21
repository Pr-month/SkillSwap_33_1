import {
  Length,
  IsOptional,
  IsDateString,
  IsString,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { Gender } from '../users.enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'Ваше имя должно быть от 2 до 50 символов' })
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000, {
    message: 'Информация о себе не должна превышать 1000 символов',
  })
  about?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Неверный формат даты рождения' })
  birthdate?: Date;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'gender должен быть одним из: MALE/FEMALE' })
  gender?: Gender;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}
