import { GlossariesService } from './glossaries.service';
export declare class GlossariesController {
    private readonly glossariesService;
    constructor(glossariesService: GlossariesService);
    findAll(): Promise<{
        code: string;
        name: string;
        description: string | undefined;
        itemCount: number;
    }[]>;
    findByCode(code: string): Promise<{
        itemCount: number;
        name: string;
        description?: string;
        code: string;
    }>;
    findItems(code: string, page?: number, limit?: number, search?: string): Promise<{
        items: unknown[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(code: string, id: string): Promise<unknown>;
    postItem(code: string, data: unknown): Promise<unknown>;
}
