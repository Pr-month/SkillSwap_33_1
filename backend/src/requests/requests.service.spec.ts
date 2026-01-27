import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Request } from './entities/request.entity';
import { Skill } from '../skills/entities/skill.entity';
import { RequestStatus } from './requests.enum';
import { NotificationsGateway } from '../websocket/gateways/notifications/notifications.gateway';

describe('RequestsService', () => {
  let service: RequestsService;

  const mockRequestRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockSkillRepository = {
    findOne: jest.fn(),
  };

  const mockNotificationGateway = {
    sendNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(Request),
          useValue: mockRequestRepository,
        },
        {
          provide: getRepositoryToken(Skill),
          useValue: mockSkillRepository,
        },
        {
          provide: NotificationsGateway,
          useValue: mockNotificationGateway,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const senderId = 'sender-id';
    const receiverId = 'receiver-id';
    const dto = {
      offeredSkillId: 'offered-skill-id',
      requestedSkillId: 'requested-skill-id',
    };

    it('должен успешно создать заявку', async () => {
      const mockSkill = {
        id: 'requested-skill-id',
        owner: { id: receiverId },
      };

      const mockRequest = {
        id: 'request-id',
        sender: { id: senderId },
        receiver: { id: receiverId },
        offeredSkill: { id: dto.offeredSkillId },
        requestedSkill: { id: dto.requestedSkillId },
      };

      mockSkillRepository.findOne.mockResolvedValue(mockSkill);
      mockRequestRepository.create.mockReturnValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue(mockRequest);
      mockNotificationGateway.sendNotification('Request is created');

      const result = await service.create(dto, senderId);

      expect(result).toEqual(mockRequest);
      expect(mockSkillRepository.findOne).toHaveBeenCalled();
      expect(mockRequestRepository.create).toHaveBeenCalled();
      expect(mockRequestRepository.save).toHaveBeenCalled();
      expect(mockNotificationGateway.sendNotification).toHaveBeenCalled();
    });

    it('должен выбросить NotFoundException если навык не найден', async () => {
      mockSkillRepository.findOne.mockResolvedValue(null);
      await expect(service.create(dto, senderId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('должен выбросить BadRequestException при заявке самому себе', async () => {
      const mockSkill = {
        id: 'requested-skill-id',
        owner: { id: senderId },
      };

      mockSkillRepository.findOne.mockResolvedValue(mockSkill);

      await expect(service.create(dto, senderId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findIncoming', () => {
    const userId = 'user-id';

    it('должен вернуть входящие заявки пользователя', async () => {
      const mockRequests = [
        {
          id: 'request-1',
          receiver: { id: userId },
          status: RequestStatus.PENDING,
        },
        {
          id: 'request-2',
          receiver: { id: userId },
          status: RequestStatus.IN_PROGRESS,
        },
      ];

      mockRequestRepository.find.mockResolvedValue(mockRequests);

      const result = await service.findIncoming(userId);

      expect(result).toEqual(mockRequests);
      expect(mockRequestRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOutgoing', () => {
    const userId = 'user-id';

    it('должен вернуть исходящие заявки пользователя', async () => {
      const mockRequests = [
        {
          id: 'request-1',
          sender: { id: userId },
          status: RequestStatus.PENDING,
        },
      ];

      mockRequestRepository.find.mockResolvedValue(mockRequests);

      const result = await service.findOutgoing(userId);

      expect(result).toEqual(mockRequests);
      expect(mockRequestRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const requestId = 'request-id';
    const userId = 'user-id';
    const updateDto = { status: RequestStatus.ACCEPTED };

    it('должен успешно обновить статус заявки', async () => {
      const mockRequest = {
        id: requestId,
        sender: { id: userId },
        receiver: { id: userId },
        status: RequestStatus.PENDING,
        isRead: false,
      };

      const updatedRequest = {
        ...mockRequest,
        status: RequestStatus.ACCEPTED,
        isRead: true,
      };

      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue(updatedRequest);

      const result = await service.update(requestId, updateDto, userId);

      expect(result.status).toBe(RequestStatus.ACCEPTED);
      expect(result.isRead).toBe(true);
    });

    it('должен выбросить NotFoundException если заявка не найдена', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(requestId, updateDto, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('должен выбросить ForbiddenException если пользователь не получатель', async () => {
      const mockRequest = {
        id: requestId,
        receiver: { id: 'another-user-id' },
      };

      mockRequestRepository.findOne.mockResolvedValue(mockRequest);

      await expect(
        service.update(requestId, updateDto, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    const requestId = 'request-id';
    const userId = 'user-id';

    it('должен успешно удалить свою заявку', async () => {
      const mockRequest = {
        id: requestId,
        sender: { id: userId },
      };

      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockRequestRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(requestId, userId, false);

      expect(result).toEqual({ message: 'Заявка успешно удалена' });
      expect(mockRequestRepository.delete).toHaveBeenCalledWith(requestId);
    });

    it('должен позволить админу удалить любую заявку', async () => {
      const mockRequest = {
        id: requestId,
        sender: { id: 'another-user-id' },
      };

      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockRequestRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(requestId, userId, true);

      expect(result).toEqual({ message: 'Заявка успешно удалена' });
    });

    it('должен выбросить NotFoundException если заявка не найдена', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(requestId, userId, false)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('должен выбросить ForbiddenException при удалении чужой заявки', async () => {
      const mockRequest = {
        id: requestId,
        sender: { id: 'another-user-id' },
      };

      mockRequestRepository.findOne.mockResolvedValue(mockRequest);

      await expect(service.remove(requestId, userId, false)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
