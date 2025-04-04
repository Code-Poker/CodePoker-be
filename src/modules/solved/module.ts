import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SolvedController } from './controller';
import { SolvedRepository } from './repository';
import { SolvedService } from './service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [SolvedController],
  providers: [SolvedService, SolvedRepository],
  exports: [SolvedService],
})
export class SolvedModule {}
