import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Игра на барабанах',
    description: 'Категория навыка',
    minLength: 6,
  })
  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  parentId?: string | null;
}
