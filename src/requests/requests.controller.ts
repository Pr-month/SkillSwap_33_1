import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/roles.enum';
import { TAuthResponse } from '../auth/types';
import {
  ApiCreateRequest,
  ApiGetIncomingRequests,
  ApiGetOutgoingRequests,
  ApiUpdateRequest,
  ApiDeleteRequest,
} from './requests.swagger';

@ApiTags('requests')
@Controller('requests')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(UserRole.USER, UserRole.ADMIN)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiCreateRequest()
  create(
    @Req() req: TAuthResponse,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    const senderId = req.user.sub;
    return this.requestsService.create(createRequestDto, senderId);
  }

  @Get('incoming')
  @ApiGetIncomingRequests()
  findIncoming(@Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.requestsService.findIncoming(userId);
  }

  @Get('outgoing')
  @ApiGetOutgoingRequests()
  findOutgoing(@Req() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.requestsService.findOutgoing(userId);
  }

  @Patch(':id')
  @ApiUpdateRequest()
  update(
    @Req() req: TAuthResponse,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    const userId = req.user.sub;
    return this.requestsService.update(id, updateRequestDto, userId);
  }

  @Delete(':id')
  @ApiDeleteRequest()
  remove(@Req() req: TAuthResponse, @Param('id') id: string) {
    const userId = req.user.sub;
    const isAdmin = req.user.role === UserRole.ADMIN;
    return this.requestsService.remove(id, userId, isAdmin);
  }
}
