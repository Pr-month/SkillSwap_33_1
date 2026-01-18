import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Request } from './entities/request.entity';
import { Skill } from '../skills/entities/skill.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestStatus } from './requests.enum';
import { NotificationsGateway } from 'src/websocket/gateways/notifications/notifications.gateway';
import { NotificationTypes } from 'src/websocket/gateways/notifications/types';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
    private notificationsWs: NotificationsGateway,
  ) {}

  async create(
    createRequestDto: CreateRequestDto,
    senderId: string,
  ): Promise<Request> {
    const requestedSkill = await this.skillsRepository.findOne({
      where: { id: createRequestDto.requestedSkillId },
      relations: ['owner'],
    });

    if (!requestedSkill) {
      throw new NotFoundException('Запрашиваемый навык не найден');
    }

    const receiverId = requestedSkill.owner.id;

    if (senderId === receiverId) {
      throw new BadRequestException('Нельзя отправить заявку самому себе');
    }

    const request = this.requestsRepository.create({
      sender: { id: senderId },
      receiver: { id: receiverId },
      offeredSkill: { id: createRequestDto.offeredSkillId },
      requestedSkill: { id: createRequestDto.requestedSkillId },
    });

    this.notificationsWs.sendNotification(request.receiver.id, {
      type: NotificationTypes.New,
      createdAt: request.createdAt,
      fromUser: request.sender.name,
    });

    return this.requestsRepository.save(request);
  }

  async findIncoming(userId: string): Promise<Request[]> {
    return this.requestsRepository.find({
      where: {
        receiver: { id: userId },
        status: In([RequestStatus.PENDING, RequestStatus.IN_PROGRESS]),
      },
      relations: ['sender', 'receiver', 'offeredSkill', 'requestedSkill'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOutgoing(userId: string): Promise<Request[]> {
    return this.requestsRepository.find({
      where: {
        sender: { id: userId },
        status: In([RequestStatus.PENDING, RequestStatus.IN_PROGRESS]),
      },
      relations: ['sender', 'receiver', 'offeredSkill', 'requestedSkill'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateRequestDto: UpdateRequestDto,
    userId: string,
  ): Promise<Request> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ['receiver'],
    });

    if (!request) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    if (request.receiver.id !== userId) {
      throw new ForbiddenException(
        'Вы можете обновлять только входящие заявки',
      );
    }

    request.status = updateRequestDto.status;
    request.isRead = true;

    let notificationType: NotificationTypes | null = null;
    switch (request.status) {
      case RequestStatus.ACCEPTED:
        notificationType = NotificationTypes.Accepted;
        break;
      case RequestStatus.REJECTED:
        notificationType = NotificationTypes.Rejected;
        break;
    }

    if (notificationType) {
      this.notificationsWs.sendNotification(request.sender.id, {
        type: notificationType,
        createdAt: new Date(),
        fromUser: request.receiver.name,
      });
    }

    return this.requestsRepository.save(request);
  }

  async remove(
    id: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<{ message: string }> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ['sender'],
    });

    if (!request) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    if (!isAdmin && request.sender.id !== userId) {
      throw new ForbiddenException(
        'Вы можете удалять только свои исходящие заявки',
      );
    }

    await this.requestsRepository.delete(id);
    return { message: 'Заявка успешно удалена' };
  }
}
