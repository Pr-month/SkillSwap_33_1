import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email!: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password!: string;
}
