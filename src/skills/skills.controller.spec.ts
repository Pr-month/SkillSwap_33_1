import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { TAuthResponse } from '../auth/types';
import { UserRole } from '../auth/roles.enum';

describe('SkillsController', () => {
  let controller: SkillsController;

  const mockSkillsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const authRequest: TAuthResponse = {
    user: {
      sub: 'test-user-id',
      email: 'test@test.com',
      role: UserRole.USER,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [{ provide: SkillsService, useValue: mockSkillsService }],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create on create', async () => {
    const dto: CreateSkillDto = {
      title: 'test title A',
      description: 'test skill desc A',
      category: 'test skill category',
      images: [],
    };
    await controller.create(authRequest, dto);
    expect(mockSkillsService.create).toHaveBeenCalledWith(
      authRequest.user.sub,
      dto,
    );
  });

  it('calls service.findAll', async () => {
    await controller.findAll({});
    expect(mockSkillsService.findAll).toHaveBeenCalled();
  });

  it('calls service.findOne with skill id', async () => {
    const skillId = 'test-skill-id';
    await controller.findOne(skillId);
    expect(mockSkillsService.findOne).toHaveBeenCalledWith(skillId);
  });

  it('calls service.update with skill id and dto', async () => {
    const skillId = 'test-skill-id';
    const dto: UpdateSkillDto = {
      title: 'test title B',
      description: 'test skill desc B',
      category: 'test skill category',
      images: [],
    };
    await controller.update(skillId, authRequest, dto);
    expect(mockSkillsService.update).toHaveBeenCalledWith(
      authRequest.user.sub,
      skillId,
      dto,
    );
  });

  it('calls service.remove with skill id', async () => {
    const skillId = 'test-skill-id';
    await controller.remove(skillId, authRequest);
    expect(mockSkillsService.remove).toHaveBeenCalledWith(
      authRequest.user.sub,
      skillId,
    );
  });
});
