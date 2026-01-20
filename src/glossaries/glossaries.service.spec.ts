import { Test, TestingModule } from '@nestjs/testing';
import { GlossariesService } from './glossaries.service';
import { IGlossaryProvider } from './interfaces/glossary-provider.interface';

class MockProvider implements IGlossaryProvider {
  code = 'mock';
  getMetadata() {
    return Promise.resolve({
      name: 'Mock Glossary',
      description: 'Mock description',
    });
  }
  findAll() {
    return Promise.resolve({ items: [{ id: '1', name: 'Test' }], total: 1 });
  }
  findOne(id: string) {
    return Promise.resolve(id === '1' ? { id: '1', name: 'Test' } : null);
  }
}

class MockProviderWithoutMetadata implements IGlossaryProvider {
  code = 'no-meta';
  findAll() {
    return Promise.resolve({ items: [], total: 0 });
  }
  findOne() {
    return Promise.resolve(null);
  }
}

describe('GlossariesService', () => {
  let service: GlossariesService;

  beforeEach(async () => {
    const provider1 = new MockProvider();
    const provider2 = new MockProviderWithoutMetadata();

    const mockProviders = new Map<string, IGlossaryProvider>();
    mockProviders.set('mock', provider1);
    mockProviders.set('no-meta', provider2);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlossariesService,
        {
          provide: 'GLOSSARY_PROVIDERS_MAP',
          useValue: mockProviders,
        },
      ],
    }).compile();

    service = module.get<GlossariesService>(GlossariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllGlossaries', () => {
    it('should return glossary list with metadata and itemCount', async () => {
      const result = await service.getAllGlossaries();
      expect(result).toEqual([
        {
          code: 'mock',
          name: 'Mock Glossary',
          description: 'Mock description',
          itemCount: 1,
        },
        {
          code: 'no-meta',
          name: 'no-meta',
          description: '',
          itemCount: 0,
        },
      ]);
    });
  });

  describe('getGlossaryMetadata', () => {
    it('should return metadata for existing glossary', async () => {
      const result = await service.getGlossaryMetadata('mock');
      expect(result).toEqual({
        code: 'mock',
        name: 'Mock Glossary',
        description: 'Mock description',
        itemCount: 1,
      });
    });

    it('should return null for non-existent glossary', async () => {
      const result = await service.getGlossaryMetadata('unknown');
      expect(result).toBeNull();
    });
  });

  describe('getItems', () => {
    it('should return items for existing glossary', async () => {
      const result = await service.getItems('mock', 1, 5, 'test');
      expect(result).toEqual({
        items: [{ id: '1', name: 'Test' }],
        total: 1,
      });
    });

    it('should throw error for non-existent glossary', async () => {
      await expect(service.getItems('unknown')).rejects.toThrow(
        "Glossary 'unknown' not found",
      );
    });
  });

  describe('getItem', () => {
    it('should return item if exists', async () => {
      const result = await service.getItem('mock', '1');
      expect(result).toEqual({ id: '1', name: 'Test' });
    });

    it('should throw error if glossary not found', async () => {
      await expect(service.getItem('unknown', '1')).rejects.toThrow(
        "Glossary 'unknown' not found",
      );
    });
  });
});
