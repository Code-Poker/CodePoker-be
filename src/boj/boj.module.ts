import { Module } from '@nestjs/common';

import { WebdriverModule } from '../webdriver/webdriver.module';
import { BojController } from './boj.controller';
import { BojRepository } from './boj.repository';
import { BojService } from './boj.service';

@Module({
  imports: [WebdriverModule],
  controllers: [BojController],
  providers: [BojService, BojRepository],
  exports: [BojService],
})
export class BojModule {}
