import { Provider } from '@nestjs/common';
import { CitiesGlossaryProvider } from './providers/cities.glossary-provider';
import { IGlossaryProvider } from './interfaces/glossary-provider.interface';

export const GLOSSARY_PROVIDERS: Provider[] = [
  CitiesGlossaryProvider,

  {
    provide: 'GLOSSARY_PROVIDERS_MAP',
    useFactory: (citiesProvider: CitiesGlossaryProvider) => {
      const map = new Map<string, IGlossaryProvider>();
      map.set(citiesProvider.code, citiesProvider);
      return map;
    },
    inject: [CitiesGlossaryProvider],
  },
];
