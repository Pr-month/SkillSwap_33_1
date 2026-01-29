export interface SearchParams {
    page: number;
    limit: number;
    search: string;
}
export interface IGlossaryProvider<TItem = unknown> {
    readonly code: string;
    getMetadata?(): Promise<{
        name: string;
        description?: string;
    }>;
    findAll(params?: SearchParams): Promise<{
        items: TItem[];
        total: number;
    }>;
    findOne(id: string): Promise<TItem | null>;
    create(data: unknown): Promise<TItem>;
}
