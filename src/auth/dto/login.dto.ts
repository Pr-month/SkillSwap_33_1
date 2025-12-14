import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email!: string;

  @IsNotEmpty({ message: 'Пароль обязателен' })
  password!: string;
}
