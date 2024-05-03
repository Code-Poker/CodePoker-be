import { Module } from '@nestjs/common';

import { BojModule } from '../boj/boj.module';
import { SolvedModule } from '../solved/solved.module';
import { SsuController } from './ssu.controller';
import { SsuService } from './ssu.service';

@Module({
  imports: [BojModule, SolvedModule],
  controllers: [SsuController],
  providers: [SsuService],
})
export class SsuModule {}
