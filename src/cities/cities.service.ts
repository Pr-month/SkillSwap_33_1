import { Injectable } from '@nestjs/common';
import { allCitiesData } from './data';
import { City } from './interfaces/city.interface';
import { CityDto } from './dto/city.dto';

@Injectable()
export class CitiesService {
  private readonly cities: readonly City[];

  constructor() {
    this.cities = allCitiesData;
  }

  findAllRaw(): readonly City[] {
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

  findAllPaginated(params: { page?: number; limit?: number; search?: string }) {
    let items = this.cities;

    if (params.search) {
      items = this.searchByName(params.search);
    }

    const total = items.length;
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.max(1, Math.min(100, params.limit ?? 10));
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);

    return {
      items: paginated.map((city) => this.toDto(city)),
      total,
    };
  }

  findOneById(id: string): CityDto | null {
    const city = this.cities.find((c) => c.id === id);
    return city ? this.toDto(city) : null;
  }

  private toDto(city: City): CityDto {
    return {
      id: city.id,
      coords: { lat: city.coords.lat, lon: city.coords.lon },
      district: city.district,
      name: city.name,
      population: city.population,
      subject: city.subject,
    };
  }
}
