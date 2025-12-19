import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';
import { TAuthResponse } from '../auth/types';
import { UserRole } from '../users/enums';

describe('SkillsController', () => {
  let controller: SkillsController;

  const mockSkillsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [{ provide: SkillsService, useValue: mockSkillsService }],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
    jest.clearAllMocks();
  });

  const mockUser: TAuthResponse['user'] = {
    sub: 'test-user-id',
    email: 'test@example.com',
    role: UserRole.USER,
  };

  const mockReq = { user: mockUser } as TAuthResponse;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create with user.sub and dto', async () => {
    const dto: CreateSkillDto = {
      title: 'test title A',
      description: 'test skill desc A',
      category: 'test skill category',
      images: [],
    };

    await controller.create(mockReq, dto);
    expect(mockSkillsService.create).toHaveBeenCalledWith(mockUser.sub, dto);
  });

  it('should call service.findAll with query', async () => {
    const query: GetSkillsQueryDto = { page: 1, limit: 10 };
    await controller.findAll(query);
    expect(mockSkillsService.findAll).toHaveBeenCalledWith(query);
  });

  it('should call service.findOne with id', async () => {
    const skillId = 'test-skill-id';
    await controller.findOne(skillId);
    expect(mockSkillsService.findOne).toHaveBeenCalledWith(skillId);
  });

  it('should call service.update with user.sub, id and dto', async () => {
    const skillId = 'test-skill-id';
    const dto: UpdateSkillDto = {
      title: 'test title B',
      description: 'test skill desc B',
      category: 'test skill category',
      images: [],
    };

    await controller.update(skillId, mockReq, dto);
    expect(mockSkillsService.update).toHaveBeenCalledWith(
      mockUser.sub,
      skillId,
      dto,
    );
  });

  it('should call service.remove with user.sub and skill id', async () => {
    const skillId = 'test-skill-id';
    await controller.remove(skillId, mockReq);
    expect(mockSkillsService.remove).toHaveBeenCalledWith(
      mockUser.sub,
      skillId,
    );
  });
});
