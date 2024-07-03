import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BojController } from './boj.controller';
import { BojRepository } from './boj.repository';
import { BojService } from './boj.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [BojController],
  providers: [BojService, BojRepository],
  exports: [BojService],
})
export class BojModule {}
