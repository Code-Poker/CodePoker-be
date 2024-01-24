import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('코드포커 API')
    .setVersion('1.0')
    .addTag('Poker', '포커 게임 생성 및 조회')
    .addTag('User', '사용자 등록 및 점수 조회')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
  await app.listen(80);
}

bootstrap().then(() => {
  console.log('Server is running on http://localhost');
});
