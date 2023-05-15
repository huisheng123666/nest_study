import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // constructor(private logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    console.log(ctx);

    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    const status = exception.getStatus();

    // this.logger.error(exception.message, exception.stack);

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      messgae: exception.message || exception.name,
    });
  }
}
