import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 关闭日志输出，这样输出的日志都将隐藏
    // logger: false,
    // logger: ['error', 'warn'],
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');

  const logger = new Logger();
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new HttpExceptionFilter(logger, httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      // whitelist: true,
    }),
  );

  await app.listen(3000);

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
