import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as process from 'node:process';

import { AppModule } from './app.module';
import { configCodePoker, configSSUJoon } from './config.swagger';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  configCodePoker(app);
  configSSUJoon(app);

  await app.listen(process.env.PORT);
}

bootstrap().then(() => {
  console.log('Server is running on http://localhost:6371');
});
