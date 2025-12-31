import {
  HttpStatus,
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export interface PostgresError extends QueryFailedError {
  code?: string;
  detail?: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | Record<string, any> = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
    } else if (exception instanceof PayloadTooLargeException) {
      status = HttpStatus.PAYLOAD_TOO_LARGE;
      message = 'Payload too large';
    } else if (exception instanceof QueryFailedError) {
      const err = exception as PostgresError;
      if (err.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry';
      }
    } else if (this.isCsrfError(exception)) {
      status = HttpStatus.FORBIDDEN;
      message = 'Invalid CSRF token';
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private isCsrfError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      exception.code === 'EBADCSRFTOKEN'
    );
  }
}
