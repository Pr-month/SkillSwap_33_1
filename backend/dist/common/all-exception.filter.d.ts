import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
export interface PostgresError extends QueryFailedError {
    code?: string;
    detail?: string;
}
export declare class AllExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
    private isCsrfError;
}
