import { Injectable, Inject } from '@nestjs/common';
import { IGlossaryProvider } from './interfaces/glossary-provider.interface';

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
      const { total: itemCount } = await p.findAll({ limit: 1 });
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
    const { total: itemCount } = await provider.findAll({ limit: 1 });

    return {
      code,
      ...meta,
      itemCount,
    };
  }

  async getItems(code: string, page = 1, limit = 10, search = '') {
    const provider = this.getGlossary(code);
    if (!provider) throw new Error(`Glossary '${code}' not found`);

    return provider.findAll({ page, limit, search });
  }

  async getItem(code: string, id: string): Promise<unknown> {
    const provider = this.getGlossary(code);
    if (!provider) throw new Error(`Glossary '${code}' not found`);
    return provider.findOne(id);
  }
}
