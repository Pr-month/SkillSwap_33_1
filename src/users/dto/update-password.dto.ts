import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'OldP@ssw0rd',
    description: 'Текущий пароль пользователя',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({
    example: 'NewStr0ngP@ss',
    description: 'Новый пароль пользователя',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
