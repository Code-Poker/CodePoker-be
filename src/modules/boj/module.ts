import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BojController } from './controller';
import { BojRepository } from './repository';
import { BojService } from './service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [BojController],
  providers: [BojService, BojRepository],
  exports: [BojService],
})
export class BojModule {}
