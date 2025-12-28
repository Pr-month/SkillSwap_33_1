import russia from './cities-russia.json';
import { City } from '../interfaces/city.interface';

export const allCitiesData = Object.freeze(russia as readonly City[]);

/*
export const allCitiesData = Object.freeze([
  ...russia,
  // ...belarus,
] as readonly City[]);
*/
