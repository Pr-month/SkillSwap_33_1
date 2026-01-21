import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  IGlossaryProvider,
  SearchParams,
} from './interfaces/glossary-provider.interface';

@Injectable()
export class GlossariesService {
  constructor(
    @Inject('GLOSSARY_PROVIDERS_MAP')
    private readonly providers: Map<string, IGlossaryProvider>,
  ) {}

  getAllGlossaries() {
    const promises = Array.from(this.providers.values()).map(async (p) => {
      const meta = p.getMetadata
        ? await p.getMetadata()
        : { name: p.code, description: '' };
      const { total: itemCount } = await p.findAll({
        page: 0,
        limit: 0,
        search: '',
      });
      return {
        code: p.code,
        name: meta.name,
        description: meta.description,
        itemCount,
      };
    });
    return Promise.all(promises);
  }

  getGlossary(code: string): IGlossaryProvider | undefined {
    return this.providers.get(code);
  }

  async getGlossaryMetadata(code: string) {
    const provider = this.getGlossary(code);
    if (!provider) return null;

    const meta = provider.getMetadata
      ? await provider.getMetadata()
      : { name: code, description: '' };
    const { total: itemCount } = await provider.findAll({
      page: 0,
      limit: 0,
      search: '',
    });

    return {
      code,
      ...meta,
      itemCount,
    };
  }

  async getItems(code: string, params: SearchParams) {
    if (params.page < 0 || params.limit < 0)
      throw new BadRequestException(
        'Номер страницы или лимит элементов не могут быть меньше 0',
      );

    const provider = this.getGlossary(code);

    if (!provider) throw new NotFoundException(`Glossary '${code}' not found`);

    return provider.findAll(params);
  }

  async getItem(code: string, id: string): Promise<unknown> {
    const provider = this.getGlossary(code);
    if (!provider) throw new NotFoundException(`Glossary '${code}' not found`);
    return provider.findOne(id);
  }
}
