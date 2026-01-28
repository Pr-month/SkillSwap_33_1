import { GLOSSARY_PROVIDERS } from './glossaries.providers';
import { CitiesGlossaryProvider } from './providers/cities.glossary-provider';
import { IGlossaryProvider } from './interfaces/glossary-provider.interface';

interface MockItem {
  id: string;
  name: string;
}

type GlossaryMapProvider = {
  provide: 'GLOSSARY_PROVIDERS_MAP';
  useFactory: (
    citiesProvider: IGlossaryProvider,
  ) => Map<string, IGlossaryProvider>;
  inject: [typeof CitiesGlossaryProvider];
};

describe('GLOSSARY_PROVIDERS', () => {
  it('should create a valid Map when useFactory is called', () => {
    const mapProvider = GLOSSARY_PROVIDERS[1] as GlossaryMapProvider;

    const mockCitiesProvider: IGlossaryProvider<MockItem> = {
      code: 'cities_ru',
      findAll: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      findOne: jest.fn().mockResolvedValue(null),
      getMetadata: jest
        .fn()
        .mockResolvedValue({ name: 'Cities', description: '' }),
      create: jest.fn().mockRejectedValue({
        id: '64c3debf-0bf7-449f-8610-a0ca0632aacf',
        name: 'Москва',
        population: 24562347856,
      }),
    };

    const result = mapProvider.useFactory(mockCitiesProvider);

    expect(result).toBeInstanceOf(Map);
    expect(result.get('cities_ru')).toBe(mockCitiesProvider);
    expect(result.size).toBe(1);
  });
});
