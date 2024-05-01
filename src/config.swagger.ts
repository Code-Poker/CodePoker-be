import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { BojModule } from './boj/boj.module';
import { GroupModule } from './group/group.module';
import { PokerModule } from './poker/poker.module';
import { SsuModule } from './ssu/ssu.module';

export const configSwagger = (app: INestApplication<any>) => {
  configCodePoker(app);
  configSSUJoon(app);
  configBOJ(app);
};

const configCodePoker = (app: INestApplication<any>) => {
  const options = new DocumentBuilder()
    .setTitle('코드포커 API')
    .setVersion('1.0')
    .addTag('Group', '그룹 생성 및 조회')
    .addTag('Poker', '포커 게임 생성 및 조회')
    .addTag('Problem', '문제 데이터 관리')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [GroupModule, PokerModule],
  });
  SwaggerModule.setup('api', app, document);
};

const configSSUJoon = (app: INestApplication<any>) => {
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

const configBOJ = (app: INestApplication<any>) => {
  const options = new DocumentBuilder()
    .setTitle('Baekjoon API')
    .setVersion('1.0')
    .addTag('BOJ', '백준 정보 조회')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [BojModule],
  });
  SwaggerModule.setup('boj', app, document);
};
