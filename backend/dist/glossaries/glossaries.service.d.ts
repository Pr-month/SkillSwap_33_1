import { IGlossaryProvider, SearchParams } from './interfaces/glossary-provider.interface';
export declare class GlossariesService {
    private readonly providers;
    constructor(providers: Map<string, IGlossaryProvider>);
    getAllGlossaries(): Promise<{
        code: string;
        name: string;
        description: string | undefined;
        itemCount: number;
    }[]>;
    private getGlossary;
    getGlossaryMetadata(code: string): Promise<{
        itemCount: number;
        name: string;
        description?: string;
        code: string;
    } | null>;
    getItems(code: string, params: SearchParams): Promise<{
        items: unknown[];
        total: number;
    }>;
    getItem(code: string, id: string): Promise<unknown>;
    postItem(code: string, data: unknown): Promise<unknown>;
}
