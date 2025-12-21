import {
  Length,
  IsEmail,
  IsOptional,
  IsDateString,
  IsString,
} from 'class-validator';
import { Gender } from '../users.enums';
import { UserRole } from '../../auth/roles.enum';

//TODO: Обновить валидацию при реализации CreateUser
export class CreateUserDto {
  @IsString()
  @Length(2, 50, { message: 'Ваше имя должно быть от 2 до 50 символов' })
  name: string;

  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @IsString()
  password: string;

  @IsOptional()
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
  gender?: Gender;

  @IsOptional()
  avatar?: string;

  role: UserRole;
}
