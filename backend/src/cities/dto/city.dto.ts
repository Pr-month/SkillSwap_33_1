import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CityDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Абаза' })
  @IsString()
  name: string;

  @ApiProperty({ example: 12272 })
  @IsNumber()
  @Min(0)
  population?: number;
}
