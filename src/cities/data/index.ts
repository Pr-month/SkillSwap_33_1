import { City } from '../interfaces/city.interface';
import { v4 as uuidv4 } from 'uuid';
import rawCities from './cities-russia.json';

if (!Array.isArray(rawCities)) {
  throw new Error('cities-russia.json must export a JSON array');
}

const enrichedRussia: City[] = rawCities.map((city) => ({
  ...city,
  id: uuidv4(),
}));

export const allCitiesData = Object.freeze(enrichedRussia);
