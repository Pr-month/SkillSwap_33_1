import { Test, TestingModule } from '@nestjs/testing';
import { GlossariesController } from './glossaries.controller';
import { GlossariesService } from './glossaries.service';
import { NotFoundException } from '@nestjs/common';

describe('GlossariesController', () => {
  let controller: GlossariesController;
  let service: GlossariesService;

  const mockGlossaryService = {
    getAllGlossaries: jest.fn(),
    getGlossaryMetadata: jest.fn(),
    getItems: jest.fn(),
    getItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlossariesController],
      providers: [
        {
          provide: GlossariesService,
          useValue: mockGlossaryService,
        },
      ],
    }).compile();

    controller = module.get<GlossariesController>(GlossariesController);
    service = module.get<GlossariesService>(GlossariesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of glossaries', async () => {
      const result = [
        { code: 'foo', name: 'Foo', description: '', itemCount: 5 },
      ];
      mockGlossaryService.getAllGlossaries.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockGlossaryService.getAllGlossaries).toHaveBeenCalled();
    });
  });

  describe('findByCode', () => {
    it('should return glossary metadata if found', async () => {
      const result = {
        code: 'foo',
        name: 'Foo',
        description: '',
        itemCount: 5,
      };
      mockGlossaryService.getGlossaryMetadata.mockResolvedValue(result);

      expect(await controller.findByCode('foo')).toBe(result);
      expect(mockGlossaryService.getGlossaryMetadata).toHaveBeenCalledWith(
        'foo',
      );
    });

    it('should throw NotFoundException if not found', async () => {
      mockGlossaryService.getGlossaryMetadata.mockResolvedValue(null);

      await expect(controller.findByCode('unknown')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockGlossaryService.getGlossaryMetadata).toHaveBeenCalledWith(
        'unknown',
      );
    });
  });

  describe('findItems', () => {
    it('should return paginated items with correct meta', async () => {
      const items = [{ id: '1', name: 'Item 1' }];
      const mockResponse = {
        items,
        total: 25,
      };
      mockGlossaryService.getItems.mockResolvedValue(mockResponse);

      const result = await controller.findItems('foo', 2, 10, 'test');

      expect(result).toEqual({
        items,
        meta: {
          total: 25,
          page: 2,
          limit: 10,
          totalPages: 3, // Math.ceil(25 / 10) = 3
        },
      });
      expect(mockGlossaryService.getItems).toHaveBeenCalledWith(
        'foo',
        2,
        10,
        'test',
      );
    });

    it('should handle default page and limit', async () => {
      const items = [{ id: '1' }];
      mockGlossaryService.getItems.mockResolvedValue({ items, total: 5 });

      const result = await controller.findItems(
        'foo',
        undefined,
        undefined,
        '',
      );

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(mockGlossaryService.getItems).toHaveBeenCalledWith(
        'foo',
        1,
        10,
        '',
      );
    });
  });

  describe('findOne', () => {
    it('should return single item if found', async () => {
      const item = { id: '1', name: 'Item 1' };
      mockGlossaryService.getItem.mockResolvedValue(item);

      expect(await controller.findOne('foo', '1')).toBe(item);
      expect(mockGlossaryService.getItem).toHaveBeenCalledWith('foo', '1');
    });

    it('should throw NotFoundException if item not found', async () => {
      mockGlossaryService.getItem.mockResolvedValue(null);

      await expect(controller.findOne('foo', '999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockGlossaryService.getItem).toHaveBeenCalledWith('foo', '999');
    });
  });
});
