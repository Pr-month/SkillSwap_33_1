import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '../requests.enum';

export class UpdateRequestDto {
  @ApiProperty({
    description: 'Новый статус заявки (accepted или rejected)',
    enum: [RequestStatus.ACCEPTED, RequestStatus.REJECTED],
    example: RequestStatus.ACCEPTED,
  })
  @IsEnum([RequestStatus.ACCEPTED, RequestStatus.REJECTED], {
    message: 'Статус может быть только accepted или rejected',
  })
  @IsNotEmpty()
  status: RequestStatus;
}
