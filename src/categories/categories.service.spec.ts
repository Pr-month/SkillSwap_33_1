import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// Создание мока категории
const createMockCategory = (
  id: string,
  name: string,
  parentId?: string | null,
): Category => ({
  id,
  name,
  parent: parentId
    ? ({ id: parentId, name: 'Parent', children: [], parent: null } as Category)
    : parentId === null
      ? null
      : undefined,
  children: [],
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<Repository<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a root category (no parentId)', async () => {
      const dto: CreateCategoryDto = { name: 'Electronics' };
      const category = createMockCategory('cat-1', 'Electronics');

      repository.create.mockReturnValue(category);
      repository.save.mockResolvedValue(category);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.findOneBy).not.toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(category);
      expect(result).toEqual(category);
    });

    it('should create a subcategory with valid parentId', async () => {
      const dto: CreateCategoryDto = { name: 'Phones', parentId: 'parent-1' };
      const parent = createMockCategory('parent-1', 'Electronics');
      const newCategory = createMockCategory('cat-1', 'Phones', 'parent-1');

      repository.create.mockReturnValue(newCategory);
      repository.findOneBy.mockResolvedValue(parent);
      repository.save.mockResolvedValue({ ...newCategory, parent });

      const result = await service.create(dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'parent-1' });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Phones',
          parent,
        }),
      );
      expect(result.parent).toEqual(parent);
    });

    it('should throw "Parent category not found" if parentId is invalid', async () => {
      const dto: CreateCategoryDto = {
        name: 'Phones',
        parentId: 'non-existent',
      };
      const newCategory = createMockCategory('cat-1', 'Phones', 'non-existent');

      repository.create.mockReturnValue(newCategory);
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(
        'Parent category not found',
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should accept parentId: null and treat as root', async () => {
      const dto: CreateCategoryDto = { name: 'Root', parentId: null };
      const category = createMockCategory('cat-1', 'Root', null);

      repository.create.mockReturnValue(category);
      repository.save.mockResolvedValue(category);

      const result = await service.create(dto);

      expect(repository.findOneBy).not.toHaveBeenCalled();
      expect(result.parent).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all categories with relations', async () => {
      const categories = [
        createMockCategory('1', 'Cat1'),
        createMockCategory('2', 'Cat2', '1'),
      ];

      repository.find.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['children', 'parent'],
      });
      expect(result).toEqual(categories);
    });
  });

  describe('findOne', () => {
    it('should return a category by id with relations', async () => {
      const category = createMockCategory('cat-1', 'Test');

      repository.findOne.mockResolvedValue(category);

      const result = await service.findOne('cat-1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
        relations: ['children', 'parent'],
      });
      expect(result).toEqual(category);
    });

    it('should throw "Category not found" if not exists', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        'Category not found',
      );
    });
  });

  describe('update', () => {
    it('should update category name only', async () => {
      const existing = createMockCategory('cat-1', 'Old Name');
      const dto: UpdateCategoryDto = { name: 'New Name' };

      repository.findOne.mockResolvedValue(existing);
      repository.save.mockResolvedValue({ ...existing, name: 'New Name' });

      const result = await service.update('cat-1', dto);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'cat-1',
          name: 'New Name',
        }),
      );
      expect(result.name).toBe('New Name');
    });

    it('should set parentId to null (detach from parent)', async () => {
      const existing = createMockCategory('cat-1', 'Child', 'parent-1');
      const dto: UpdateCategoryDto = { parentId: null };

      repository.findOne.mockResolvedValue(existing);
      repository.save.mockResolvedValue({ ...existing, parent: null });

      const result = await service.update('cat-1', dto);

      expect(result.parent).toBeNull();
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          parent: null,
        }),
      );
    });

    it('should update parentId to new valid parent', async () => {
      const existing = createMockCategory('cat-1', 'Child');
      const newParent = createMockCategory('new-parent', 'New Parent');
      const dto: UpdateCategoryDto = { parentId: 'new-parent' };

      repository.findOne.mockResolvedValue(existing);
      repository.findOneBy.mockResolvedValue(newParent);
      repository.save.mockResolvedValue({ ...existing, parent: newParent });

      const result = await service.update('cat-1', dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'new-parent' });
      expect(result.parent).toEqual(newParent);
    });

    it('should throw "Parent category not found" on invalid parentId in update', async () => {
      const existing = createMockCategory('cat-1', 'Child');
      const dto: UpdateCategoryDto = { parentId: 'invalid' };

      repository.findOne.mockResolvedValue(existing);
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.update('cat-1', dto)).rejects.toThrow(
        'Parent category not found',
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should ignore parentId if undefined (partial update)', async () => {
      const existing = createMockCategory('cat-1', 'Child', 'old-parent');
      const dto: UpdateCategoryDto = { name: 'Updated' }; // parentId не передан

      repository.findOne.mockResolvedValue(existing);
      repository.save.mockResolvedValue({ ...existing, name: 'Updated' });

      const result = await service.update('cat-1', dto);

      expect(repository.findOneBy).not.toHaveBeenCalled();
      expect(result.name).toBe('Updated');
      expect(result.parent?.id).toBe('old-parent'); // parent не изменился
    });
  });

  describe('remove', () => {
    it('should delete category by id', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove('cat-1');

      expect(repository.delete).toHaveBeenCalledWith('cat-1');
    });
  });
});
