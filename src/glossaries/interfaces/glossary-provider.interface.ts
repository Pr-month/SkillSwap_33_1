export interface IGlossaryProvider<TItem = any> {
  readonly code: string;
  getMetadata?(): Promise<{ name: string; description?: string }>;
  findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ items: TItem[]; total: number }>;
  findOne(id: string): Promise<TItem | null>;
}
