import { CityDto } from './dto/city.dto';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { SearchParams } from 'src/glossaries/interfaces/glossary-provider.interface';
import { CreateCityDto } from './dto/create-city.dto';
export declare class CitiesService {
    private citiesRepository;
    constructor(citiesRepository: Repository<City>);
    findAllPaginated({ page, limit, search }: SearchParams): Promise<{
        items: CityDto[];
        total: number;
    }>;
    findOneById(id: string): Promise<CityDto | null>;
    create(data: CreateCityDto): Promise<CityDto>;
    private toDto;
}
