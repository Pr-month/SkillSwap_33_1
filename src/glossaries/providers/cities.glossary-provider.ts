import { Injectable } from '@nestjs/common';
import { CitiesService } from '../../cities/cities.service';
import { CityDto } from '../../cities/dto/city.dto';
import { IGlossaryProvider } from '../interfaces/glossary-provider.interface';

@Injectable()
export class CitiesGlossaryProvider implements IGlossaryProvider<CityDto> {
  readonly code = 'cities_ru';

  constructor(private readonly citiesService: CitiesService) {}

  getMetadata() {
    return Promise.resolve({
      name: 'Города России',
      description: 'Справочник городов РФ из открытых данных',
    });
  }

  findAll(params: { page?: number; limit?: number; search?: string }) {
    const result = this.citiesService.findAllPaginated(params);
    return Promise.resolve(result);
  }

  findOne(id: string) {
    const result = this.citiesService.findOneById(id);
    return Promise.resolve(result);
  }
}
