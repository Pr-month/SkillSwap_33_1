import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'OldP@ssw0rd',
    description: 'Текущий пароль пользователя',
    minLength: 6,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Текущий пароль обязателен' })
  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  oldPassword: string;

  @ApiProperty({
    example: 'NewStr0ngP@ss',
    description: 'Новый пароль пользователя',
    minLength: 6,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Новый пароль обязателен' })
  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  newPassword: string;
}
