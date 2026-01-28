import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateCityDto {
  @IsString({ message: 'Название должно быть строкой' })
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsInt({ message: 'Население должно быть целым числом' })
  population: number;
}
