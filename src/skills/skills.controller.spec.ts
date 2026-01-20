/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../auth/roles.enum';
import { TAuthResponse } from '../auth/types';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';

describe('SkillsController', () => {
  let controller: SkillsController;
  let skillsService: jest.Mocked<SkillsService>;

  const fixedDate = new Date('2026-01-01T00:00:00.000Z');

  // Создаем полный мок с нужными методами
  const mockSkillsService: Partial<SkillsService> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addToFavorite: jest.fn(),
    removeFromFavorite: jest.fn(),
  };

  const authRequest: TAuthResponse = {
    user: {
      sub: 'test-user-id',
      email: 'test@test.com',
      role: UserRole.USER,
    },
  };

  const mockCategory: Category = {
    id: 'category-id-1',
    name: 'Programming',
    parent: null,
    children: [],
  };

  const mockSkill = {
    id: 'skill-id-1',
    title: 'React Development',
    description: 'Frontend development with React',
    category: mockCategory,
    images: ['image1.jpg'],
    owner: {
      id: 'owner-id',
      name: 'John Doe',
    } as User,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: mockSkillsService,
        },
      ],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
    // Используем правильное приведение типов
    skillsService = mockSkillsService as jest.Mocked<SkillsService>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create on create', async () => {
      const dto: CreateSkillDto = {
        title: 'test title A',
        description: 'test skill desc A',
        category: 'test-category-id',
        images: [],
      };
      await controller.create(authRequest, dto);
      expect(skillsService.create).toHaveBeenCalledWith(
        authRequest.user.sub,
        dto,
      );
    });
  });

  describe('GET /skills (получить список навыков) (findAll)', () => {
    it('должен вызывать service.findAll с параметрами запроса', async () => {
      const query: GetSkillsQueryDto = { page: 1, limit: 10 };
      const mockResult = {
        data: [mockSkill],
        page: 1,
        totalPages: 1,
      };

      skillsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(skillsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResult);
      expect(result.data).toHaveLength(1);
    });

    it('должен обрабатывать поисковый запрос', async () => {
      const query: GetSkillsQueryDto = {
        page: 1,
        limit: 10,
        search: 'react',
      };
      const mockResult = {
        data: [mockSkill],
        page: 1,
        totalPages: 1,
      };

      skillsService.findAll.mockResolvedValue(mockResult);

      await controller.findAll(query);

      expect(skillsService.findAll).toHaveBeenCalledWith(query);
    });

    it('должен обрабатывать фильтр по категориям', async () => {
      const query: GetSkillsQueryDto = {
        page: 1,
        limit: 10,
        category: 'category-id-1',
      };
      const mockResult = {
        data: [mockSkill],
        page: 1,
        totalPages: 1,
      };

      skillsService.findAll.mockResolvedValue(mockResult);

      await controller.findAll(query);

      expect(skillsService.findAll).toHaveBeenCalledWith(query);
    });

    it('должен обрабатывать пустой результат', async () => {
      const query: GetSkillsQueryDto = { page: 1, limit: 10 };
      const mockResult = {
        data: [],
        page: 1,
        totalPages: 0,
      };

      skillsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(skillsService.findAll).toHaveBeenCalledWith(query);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('GET /skills/:id (получить навык по ID)(findOne)', () => {
    it('должен возвращать навык по ID', async () => {
      skillsService.findOne.mockResolvedValue(mockSkill);

      const result = await controller.findOne('skill-id-1');

      expect(skillsService.findOne).toHaveBeenCalledWith('skill-id-1');
      expect(result).toEqual(mockSkill);
      expect(result.id).toBe('skill-id-1');
      expect(result.title).toBe('React Development');
    });

    it('должен вызывать NotFoundException, когда навык не найден', async () => {
      skillsService.findOne.mockRejectedValue(
        new NotFoundException('Skill not found'),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(skillsService.findOne).toHaveBeenCalledWith('non-existent-id');
    });

    it('должен включать информацию о категории и владельце', async () => {
      skillsService.findOne.mockResolvedValue(mockSkill);

      const result = await controller.findOne('skill-id-1');

      expect(result.category).toBeDefined();
      expect(result.category.name).toBe('Programming');
      expect(result.owner).toBeDefined();
      expect(result.owner.name).toBe('John Doe');
    });
  });

  describe('POST /skills/:id/favorite (добавить в избранное)(addToFavorite)', () => {
    it('должен успешно добавить навык в избранное', async () => {
      const successResponse = { message: 'Навык добавлен в избранное' };
      skillsService.addToFavorite.mockResolvedValue(successResponse);

      const result = await controller.addToFavorite('skill-id-1', authRequest);

      expect(skillsService.addToFavorite).toHaveBeenCalledWith(
        authRequest.user.sub,
        'skill-id-1',
      );
      expect(result).toEqual(successResponse);
    });

    it('должен вызывать NotFoundException, когда навык не найден', async () => {
      skillsService.addToFavorite.mockRejectedValue(
        new NotFoundException('Skill not found'),
      );

      await expect(
        controller.addToFavorite('non-existent-id', authRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('должен вызывать ConflictException, когда навык уже в избранном', async () => {
      skillsService.addToFavorite.mockRejectedValue(
        new ConflictException('Навык уже в избранном'),
      );

      await expect(
        controller.addToFavorite('skill-id-1', authRequest),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('DELETE /skills/:id/favorite (удалить из избранного) (removeFromFavorite)', () => {
    it('должен успешно удалить навык из избранного', async () => {
      const successResponse = { message: 'Навык удалён из избранного' };
      skillsService.removeFromFavorite.mockResolvedValue(successResponse);

      const result = await controller.removeFromFavorite(
        'skill-id-1',
        authRequest,
      );

      expect(skillsService.removeFromFavorite).toHaveBeenCalledWith(
        authRequest.user.sub,
        'skill-id-1',
      );
      expect(result).toEqual(successResponse);
    });

    it('должен вызывать NotFoundException, когда навык не найден в избранном', async () => {
      skillsService.removeFromFavorite.mockRejectedValue(
        new NotFoundException('Навык не найден в избранном'),
      );

      await expect(
        controller.removeFromFavorite('skill-id-1', authRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('обновление навыка (update)', () => {
    it('должен вызывать service.update с ID навыка и DTO', async () => {
      const skillId = 'test-skill-id';
      const dto: UpdateSkillDto = {
        title: 'test title B',
        description: 'test skill desc B',
        category: 'test-category-id',
        images: [],
      };
      await controller.update(skillId, authRequest, dto);
      expect(skillsService.update).toHaveBeenCalledWith(
        authRequest.user.sub,
        skillId,
        dto,
      );
    });
  });

  describe('удаление навыка (remove)', () => {
    it('должен вызывать service.remove с ID навыка', async () => {
      const skillId = 'test-skill-id';
      await controller.remove(skillId, authRequest);
      expect(skillsService.remove).toHaveBeenCalledWith(
        authRequest.user.sub,
        skillId,
      );
    });
  });
});
