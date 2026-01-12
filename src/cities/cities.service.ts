import { Injectable } from '@nestjs/common';
import { allCitiesData } from './data';
import { City } from './interfaces/city.interface';

@Injectable()
export class CitiesService {
  private readonly cities: readonly City[];

  constructor() {
    this.cities = allCitiesData;
  }

  findAll(): readonly City[] {
    return this.cities;
  }

  findBySubject(subject: string): City[] {
    return this.cities.filter((city) => city.subject === subject);
  }

  findByDistrict(district: string): City[] {
    return this.cities.filter((city) => city.district === district);
  }

  findByName(name: string): City | undefined {
    return this.cities.find((city) => city.name === name);
  }

  searchByName(query: string): City[] {
    const q = query.trim().toLowerCase();
    return this.cities.filter((city) => city.name.toLowerCase().includes(q));
  }
}
