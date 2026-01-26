import rawCities from './cities-russia.json';
import dataSource from '../../config/db.config';
import { City } from 'src/cities/entities/city.entity';

async function initCities() {
  await dataSource.initialize();
  const cityRepository = dataSource.getRepository(City);
  await Promise.all(rawCities.map((city) => cityRepository.save(city)));
}

initCities().catch((e) => console.error(e));
