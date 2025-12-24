import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;
}
