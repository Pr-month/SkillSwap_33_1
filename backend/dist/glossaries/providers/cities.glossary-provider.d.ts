import { CitiesService } from '../../cities/cities.service';
import { CityDto } from '../../cities/dto/city.dto';
import { IGlossaryProvider, SearchParams } from '../interfaces/glossary-provider.interface';
export declare class CitiesGlossaryProvider implements IGlossaryProvider<CityDto> {
    private readonly citiesService;
    readonly code = "cities_ru";
    constructor(citiesService: CitiesService);
    getMetadata(): Promise<{
        name: string;
        description: string;
    }>;
    findAll(params: SearchParams): Promise<{
        items: CityDto[];
        total: number;
    }>;
    findOne(id: string): Promise<CityDto | null>;
    create(data: unknown): Promise<CityDto>;
}
