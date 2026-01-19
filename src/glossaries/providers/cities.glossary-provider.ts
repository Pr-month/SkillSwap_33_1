import { Injectable } from '@nestjs/common';
import { CitiesService } from '../../cities/cities.service';
import { CityDto } from '../../cities/dto/city.dto';
import {
  IGlossaryProvider,
  SearchParams,
} from '../interfaces/glossary-provider.interface';

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

  findAll(params: SearchParams) {
    return this.citiesService.findAllPaginated(params);
  }

  findOne(id: string) {
    return this.citiesService.findOneById(id);
  }
}
