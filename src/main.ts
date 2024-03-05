import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('코드포커 API')
    .setVersion('1.0')
    .addTag('OAuth', '사용자 인증')
    .addTag('Poker', '포커 게임 생성 및 조회')
    .addTag('Problem', '문제 데이터 관리')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`,
          scopes: {
            'create:poker': '포커 생성 권한',
          },
        },
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(6370);
}

bootstrap().then(() => {
  console.log('Server is running on http://localhost:6370');
});
