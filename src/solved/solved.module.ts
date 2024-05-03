import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SolvedRepository } from './solved.repository';
import { SolvedService } from './solved.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [SolvedService, SolvedRepository],
  exports: [SolvedService],
})
export class SolvedModule {}
