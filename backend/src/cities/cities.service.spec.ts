import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('uuid', () => ({
  v4: jest
    .fn()
    .mockImplementation(
      () => 'mock-uuid-' + Math.random().toString(36).slice(2, 9),
    ),
}));

describe('CitiesService', () => {
  let service: CitiesService;
  //let repository: Repository<City>;

  const mockCityRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    //repository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('findAllRaw', () => {
  //   it('should return all cities', () => {
  //     const result = service.findAllRaw();
  //     expect(result).toHaveLength(4);
  //     expect(result[0].name).toBe('Абаза');
  //     expect(result[0].id).toBe('1');
  //   });
  // });

  // describe('findBySubject', () => {
  //   it('should return cities in Хакасия', () => {
  //     const result = service.findBySubject('Хакасия');
  //     expect(result).toHaveLength(2);
  //     expect(result.map((c) => c.name)).toEqual(['Абаза', 'Абакан']);
  //     expect(result[0].id).toBe('1');
  //   });
  // });

  // describe('findByDistrict', () => {
  //   it('should return cities in Сибирский district', () => {
  //     const result = service.findByDistrict('Сибирский');
  //     expect(result).toHaveLength(2);
  //     expect(result.map((c) => c.name)).toEqual(['Абаза', 'Абакан']);
  //   });

  //   it('should return empty array for unknown district', () => {
  //     const result = service.findByDistrict('Дальневосточный');
  //     expect(result).toHaveLength(0);
  //   });
  // });

  // describe('findByName', () => {
  //   it('should return city by exact name', () => {
  //     const city = service.findByName('Абакан');
  //     expect(city).toBeDefined();
  //     expect(city!.name).toBe('Абакан');
  //     expect(city!.id).toBe('2');
  //   });

  //   it('should return undefined for unknown name', () => {
  //     const city = service.findByName('Москва');
  //     expect(city).toBeUndefined();
  //   });
  // });

  // describe('searchByName', () => {
  //   it('should return cities matching substring (case-insensitive)', () => {
  //     const result = service.searchByName('аба');
  //     expect(result).toHaveLength(2);
  //     expect(result.map((c) => c.name)).toEqual(['Абаза', 'Абакан']);
  //   });

  //   it('should return empty array for no matches', () => {
  //     const result = service.searchByName('xyz');
  //     expect(result).toHaveLength(0);
  //   });

  //   it('should trim and normalize query', () => {
  //     const result = service.searchByName('  АБА  ');
  //     expect(result).toHaveLength(2);
  //   });
  // });

  // describe('findAllPaginated (glossary facade)', () => {
  //   it('should return paginated items as CityDto[]', () => {
  //     const result = service.findAllPaginated({ page: 1, limit: 2 });

  //     expect(result.total).toBe(4);
  //     expect(result.items).toHaveLength(2);
  //     expect(result.items[0]).toEqual({
  //       id: '1',
  //       coords: { lat: '52.65', lon: '90.083333333333' },
  //       district: 'Сибирский',
  //       name: 'Абаза',
  //       population: 12272,
  //       subject: 'Хакасия',
  //     });

  //     expect(result.items[0]).toHaveProperty('id');
  //     expect(result.items[0]).toHaveProperty('name');
  //   });

  //   it('should support search', () => {
  //     const result = service.findAllPaginated({ search: 'аба' });
  //     expect(result.items).toHaveLength(2);
  //     expect(result.items.map((c) => c.name)).toEqual(['Абаза', 'Абакан']);
  //   });

  //   it('should respect pagination', () => {
  //     const result = service.findAllPaginated({ page: 2, limit: 2 });
  //     expect(result.items).toHaveLength(2);
  //     expect(result.items[0].name).toBe('Абдулино');
  //   });

  //   it('should apply default limit and page', () => {
  //     const result = service.findAllPaginated({});
  //     expect(result.total).toBe(4);
  //     expect(result.items).toHaveLength(4);
  //   });

  //   it('should cap limit at 100', () => {
  //     const result = service.findAllPaginated({ limit: 200 });
  //     expect(result.items).toHaveLength(4);
  //   });
  // });

  // describe('findOneById', () => {
  //   it('should return city by id as CityDto', () => {
  //     const city = service.findOneById('2');
  //     expect(city).toEqual({
  //       id: '2',
  //       coords: { lat: '53.71667', lon: '91.41667' },
  //       district: 'Сибирский',
  //       name: 'Абакан',
  //       population: 184769,
  //       subject: 'Хакасия',
  //     });
  //   });

  //   it('should return null for unknown id', () => {
  //     const city = service.findOneById('999');
  //     expect(city).toBeNull();
  //   });
  // });
});
