import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, IsObject } from 'class-validator';

class CoordsDto {
  @ApiProperty({ example: '52.65' })
  @IsString()
  lat: string;

  @ApiProperty({ example: '90.083333333333' })
  @IsString()
  lon: string;
}

export class CityDto {
  @ApiProperty({ type: CoordsDto })
  @IsObject()
  coords: CoordsDto;

  @ApiProperty({ example: 'Сибирский' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Абаза' })
  @IsString()
  name: string;

  @ApiProperty({ example: 12272 })
  @IsNumber()
  @Min(0)
  population: number;

  @ApiProperty({ example: 'Хакасия' })
  @IsString()
  subject: string;
}
