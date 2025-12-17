import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create on create', () => {
    const req = { user: 'test-user-ud' };

    const dto: CreateSkillDto = {
      title: 'test title A',
      description: 'test skill desc A',
      category: 'test skill category',
      images: [],
    };
    controller.create(req, dto);
    expect(mockSkillsService.create).toHaveBeenCalledWith(req.user, dto);
  });

  it('calls service.findAll', () => {
    controller.findAll();
    expect(mockSkillsService.findAll).toHaveBeenCalled();
  });

  it('calls service.findOne with skill id', () => {
    const skillId = 'test-skill-id';
    controller.findOne(skillId);
    expect(mockSkillsService.findOne).toHaveBeenCalledWith(skillId);
  });

  it('calls service.update with skill id and dto', () => {
    const req = { user: 'test-user-ud' };
    const skillId = 'test-skill-id';
    const dto: UpdateSkillDto = {
      title: 'test title B',
      description: 'test skill desc B',
      category: 'test skill category',
      images: [],
    };
    controller.update(skillId, req, dto);
    expect(mockSkillsService.update).toHaveBeenCalledWith(
      req.user,
      skillId,
      dto,
    );
  });

  it('calls service.remove with skill id', () => {
    const req = { user: 'test-user-ud' };
    const skillId = 'test-skill-id';
    controller.remove(skillId, req);
    expect(mockSkillsService.remove).toHaveBeenCalledWith(req.user, skillId);
  });
});
