import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  ArrayMaxSize,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsValidUrl } from '../../utils/custom-url-validator.util';

export class CreateSkillDto {
  @ApiProperty({
    example: 'Игра на барабанах',
    description: 'Название навыка',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2, {
    message:
      'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(50, {
    message:
      'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  title: string;

  @ApiProperty({
    example: 'Игра на барабанах',
    description: 'Подробное описание навыка',
    minLength: 2,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(2, {
    message:
      'Description is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(1000, {
    message:
      'Description is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  description: string;

  //TODO: обновить под enity навыка
  @ApiProperty({
    example: '11111111-2222-3333-4444-555555555555',
    description: 'ID категории (UUID)',
    format: 'uuid',
  })
  @IsUUID()
  category: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['http://localhost:3000/public/images/skills/drums-1.png'],
    description: 'Массив URL картинок (до 10 штук)',
  })
  @IsOptional()
  @IsArray()
  @IsValidUrl({
    each: true,
    message: 'Each value in images must be a URL address',
  })
  @ArrayMaxSize(10)
  images?: string[] = [];
}
