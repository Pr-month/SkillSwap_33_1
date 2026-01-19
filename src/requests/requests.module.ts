import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Request } from './entities/request.entity';
import { Skill } from '../skills/entities/skill.entity';
import { WebSocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Request, Skill]), WebSocketModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
