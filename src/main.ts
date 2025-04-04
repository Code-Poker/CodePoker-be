import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as process from 'node:process';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { configSwagger } from './config.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  configSwagger(app);

  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/api`);
  console.log(`SSU API is running on http://localhost:${process.env.PORT}/ssu`);
  console.log(`solved API is running on http://localhost:${process.env.PORT}/solved`);
});
