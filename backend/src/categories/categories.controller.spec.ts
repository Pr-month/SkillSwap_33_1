import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: jest.Mocked<CategoriesService>;

  beforeEach(async () => {
    // Мок-реализация CategoriesService
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const dto: CreateCategoryDto = { name: 'SomeCategory', parentId: null };
      const result: Category = {
        id: 'uuid-123',
        name: 'SomeCategory',
        parent: null,
        children: [],
      };

      service.create.mockResolvedValue(result);

      const response = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });

    it('should throw if service throws', async () => {
      const dto: CreateCategoryDto = { name: 'SomeCategory' };
      service.create.mockRejectedValue(new Error('Parent not found'));

      await expect(controller.create(dto)).rejects.toThrow('Parent not found');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result: Category[] = [
        { id: '1', name: 'Cat1', parent: null, children: [] },
        { id: '2', name: 'Cat2', parent: null, children: [] },
      ];

      service.findAll.mockResolvedValue(result);

      const response = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const id = 'valid-id';
      const result: Category = {
        id,
        name: 'Test',
        parent: null,
        children: [],
      };

      service.findOne.mockResolvedValue(result);

      const response = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });

    it('should propagate service errors', async () => {
      const id = 'invalid-id';
      service.findOne.mockRejectedValue(new Error('Category not found'));

      await expect(controller.findOne(id)).rejects.toThrow(
        'Category not found',
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update and return updated category', async () => {
      const id = 'cat-1';
      const dto: UpdateCategoryDto = {
        name: 'Updated Name',
        parentId: 'parent-1',
      };
      const result: Category = {
        id,
        name: 'Updated Name',
        parent: {
          id: 'parent-1',
          name: 'Parent',
          children: [],
          parent: null,
        },
        children: [],
      };

      service.update.mockResolvedValue(result);

      const response = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(response).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return void', async () => {
      const id = 'cat-1';

      service.remove.mockResolvedValue(undefined);

      const response = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(response).toBeUndefined();
    });

    it('should propagate errors from service', async () => {
      const id = 'cat-1';
      service.remove.mockRejectedValue(
        new Error('Cannot delete: has children'),
      );

      await expect(controller.remove(id)).rejects.toThrow(
        'Cannot delete: has children',
      );
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
