import {
  IsArray,
  IsString,
  IsUrl,
  ArrayMaxSize,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateSkillDto {
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
  @IsUUID()
  category: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @ArrayMaxSize(10)
  images?: string[] = [];
}
