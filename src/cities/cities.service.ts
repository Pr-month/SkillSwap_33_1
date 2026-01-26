import { Injectable } from '@nestjs/common';
import { CityDto } from './dto/city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { SearchParams } from 'src/glossaries/interfaces/glossary-provider.interface';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  // findAllRaw(): readonly City[] {
  //   return this.cities;
  // }

  // findBySubject(subject: string): City[] {
  //   return this.cities.filter((city) => city.subject === subject);
  // }

  // findByDistrict(district: string): City[] {
  //   return this.cities.filter((city) => city.district === district);
  // }

  // findByName(name: string): City | undefined {
  //   return this.cities.find((city) => city.name === name);
  // }

  // searchByName(query: string): City[] {
  //   const q = query.trim().toLowerCase();
  //   return this.cities.filter((city) => city.name.toLowerCase().includes(q));
  // }

  async findAllPaginated({ page, limit, search }: SearchParams) {
    const pattern = search.replace(/[^а-яёА-ЯЁ]/g, '[^а-яёА-ЯЁ]');
    const fullPattern = `.*${pattern}.*`;

    const cities = await this.citiesRepository
      .createQueryBuilder()
      .where('name ~* :pattern', { pattern: fullPattern })
      .select(['id', 'name'])
      .orderBy('population', 'DESC')
      .limit(limit)
      .offset(limit * page)
      .getRawMany<Pick<City, 'id' | 'name'>>();

    return {
      items: cities.map((city) => this.toDto(city)),
      total: await this.citiesRepository.count(),
    };
  }

  async findOneById(id: string): Promise<CityDto | null> {
    const city = await this.citiesRepository.findOneBy({ id });
    return city ? this.toDto(city) : null;
  }

  async create(data: CreateCityDto): Promise<CityDto> {
    const saved = await this.citiesRepository.save(data);
    return this.toDto(saved);
  }

  private toDto(city: Pick<City, 'id' | 'name'> & Partial<City>): CityDto {
    return {
      id: city.id,
      name: city.name,
      population: city.population,
    };
  }
}
