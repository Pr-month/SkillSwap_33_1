import { Injectable } from '@nestjs/common';
import { CitiesService } from '../../cities/cities.service';
import { CityDto } from '../../cities/dto/city.dto';
import {
  IGlossaryProvider,
  SearchParams,
} from '../interfaces/glossary-provider.interface';
import { CreateCityDto } from 'src/cities/dto/create-city.dto';
import { plainToInstance } from 'class-transformer';

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

  create(data: unknown) {
    const dto = plainToInstance(CreateCityDto, data);

    return this.citiesService.create(dto);
  }
}
