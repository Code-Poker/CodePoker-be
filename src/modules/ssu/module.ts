import { BojModule } from '@modules/boj/module';
import { SolvedModule } from '@modules/solved/module';
import { Module } from '@nestjs/common';

import { SsuController } from './controller';
import { SsuService } from './service';

@Module({
  imports: [BojModule, SolvedModule],
  controllers: [SsuController],
  providers: [SsuService],
})
export class SsuModule {}
