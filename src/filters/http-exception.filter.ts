import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception['response'] || 'Internal Server Error';

    // if (exception instanceof QueryFailedError) {
    //   message = exception.message;
    //   if (exception.driverError.errno === 1062) {
    //     message = '唯一索引冲突';
    //   }
    // }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      params: request.params,
      timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: message,
    };
    this.httpAdapterHost.httpAdapter.reply(response, responseBody, httpStatus);
  }
}
