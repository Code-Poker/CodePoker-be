import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SolvedController } from './solved.controller';
import { SolvedRepository } from './solved.repository';
import { SolvedService } from './solved.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [SolvedController],
  providers: [SolvedService, SolvedRepository],
  exports: [SolvedService],
})
export class SolvedModule {}
