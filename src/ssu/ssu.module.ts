import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SsuController } from './ssu.controller';
import { SsuService } from './ssu.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [SsuController],
  providers: [SsuService],
})
export class SsuModule {}
