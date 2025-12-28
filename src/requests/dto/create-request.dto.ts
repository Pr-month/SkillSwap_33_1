import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    description: 'ID навыка, который предлагает отправитель',
    example: '22222222-3333-4444-5555-666666666666',
  })
  @IsUUID()
  @IsNotEmpty()
  offeredSkillId: string;

  @ApiProperty({
    description: 'ID навыка, который хочет получить отправитель',
    example: '33333333-4444-5555-6666-777777777777',
  })
  @IsUUID()
  @IsNotEmpty()
  requestedSkillId: string;
}
