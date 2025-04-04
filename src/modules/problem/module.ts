import { DatabaseModule } from '@database/database.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ProblemController } from './controller';
import { problemProviders } from './providers';
import { ProblemRepository } from './repository';
import { ProblemService } from './service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [ProblemController],
  providers: [ProblemService, ...problemProviders, ProblemRepository],
})
export class ProblemModule {}
