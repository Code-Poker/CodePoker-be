import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { ProblemController } from './problem.controller';
import { problemProviders } from './problem.providers';
import { ProblemRepository } from './problem.repository';
import { ProblemService } from './problem.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [ProblemController],
  providers: [ProblemService, ...problemProviders, ProblemRepository],
})
export class ProblemModule {}
