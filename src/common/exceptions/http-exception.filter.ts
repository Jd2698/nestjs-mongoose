import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception['code'] === 11000) {
      return response.status(HttpStatus.CONFLICT).json({
        status: HttpStatus.CONFLICT,
        message: `Duplicate key: ${Object.values(exception['keyValue'])}`,
        error: 'Conflict',
      });
    }

    const status = exception.getStatus();
    const message = exception['response'].message;
    const error = exception['response'].error;

    response.status(status).json({
      status: status,
      message: message,
      error: error,
    });
  }
}
