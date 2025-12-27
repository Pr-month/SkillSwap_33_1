import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';

jest.mock('./data', () => ({
  allCitiesData: [
    {
      coords: { lat: '52.65', lon: '90.083333333333' },
      district: 'Сибирский',
      name: 'Абаза',
      population: 12272,
      subject: 'Хакасия',
    },
    {
      coords: { lat: '53.71667', lon: '91.41667' },
      district: 'Сибирский',
      name: 'Абакан',
      population: 184769,
      subject: 'Хакасия',
    },
    {
      coords: { lat: '53.68333', lon: '53.65' },
      district: 'Приволжский',
      name: 'Абдулино',
      population: 17274,
      subject: 'Оренбургская область',
    },
    {
      coords: { lat: '44.86667', lon: '38.16667' },
      district: 'Южный',
      name: 'Абинск',
      population: 39511,
      subject: 'Краснодарский край',
    },
  ] as const,
}));

describe('CitiesService', () => {
  let service: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitiesService],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cities', () => {
      const result = service.findAll();
      expect(result).toHaveLength(4);
      expect(result[0].name).toBe('Абаза');
    });
  });

  describe('findBySubject', () => {
    it('should return cities in Хакасия', () => {
      const result = service.findBySubject('Хакасия');
      expect(result).toHaveLength(2);
      expect(result.map((c) => c.name)).toEqual(['Абаза', 'Абакан']);
    });

    it('should return empty for unknown subject', () => {
      expect(service.findBySubject('Неизвестный')).toEqual([]);
    });
  });

  describe('findByDistrict', () => {
    it('should return cities in Сибирский', () => {
      const result = service.findByDistrict('Сибирский');
      expect(result).toHaveLength(2);
    });

    it('should be case-sensitive', () => {
      expect(service.findByDistrict('сибирский')).toEqual([]);
    });
  });

  describe('findByName', () => {
    it('should find Абакан', () => {
      expect(service.findByName('Абакан')?.name).toBe('Абакан');
    });

    it('should not match lowercase', () => {
      expect(service.findByName('абакан')).toBeUndefined();
    });
  });

  describe('searchByName', () => {
    it('should find all 4 cities with "аб"', () => {
      const result = service.searchByName('аб');
      expect(result).toHaveLength(4);
      expect(result.map((c) => c.name)).toEqual([
        'Абаза',
        'Абакан',
        'Абдулино',
        'Абинск',
      ]);
    });

    it('should be case-insensitive and trim spaces', () => {
      expect(service.searchByName('  АБ  ')).toHaveLength(4);
    });

    it('should return all on empty query', () => {
      expect(service.searchByName('')).toHaveLength(4);
    });

    it('should return none on no match', () => {
      expect(service.searchByName('xyz')).toEqual([]);
    });
  });
});
