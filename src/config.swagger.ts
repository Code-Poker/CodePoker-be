import { BojModule } from '@modules/boj/module';
import { GroupModule } from '@modules/group/module';
import { PokerModule } from '@modules/poker/module';
import { SolvedModule } from '@modules/solved/module';
import { SsuModule } from '@modules/ssu/module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app: INestApplication) => {
  configCodePoker(app);
  configSSUJoon(app);
  configSolved(app);
};

const configCodePoker = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('코드포커 API')
    .setVersion('1.0')
    .addTag('BOJ', '백준 데이터 조회')
    .addTag('Group', '그룹 생성 및 조회')
    .addTag('Poker', '포커 게임 생성 및 조회')
    .addTag('Problem', '문제 데이터 관리')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [GroupModule, PokerModule, BojModule],
  });
  SwaggerModule.setup('api', app, document);
};

const configSSUJoon = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('BaekSSU API')
    .setVersion('1.0')
    .addTag('SSU', '숭실대 백준 문제 풀이 정보 조회')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [SsuModule],
  });
  SwaggerModule.setup('ssu', app, document);
};

const configSolved = (app: INestApplication<any>) => {
  const options = new DocumentBuilder().setTitle('solved API').setVersion('1.0').addTag('solved', 'solved api').build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [SolvedModule],
  });
  SwaggerModule.setup('solved', app, document);
};
