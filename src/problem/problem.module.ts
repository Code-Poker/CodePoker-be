import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [ProblemController],
  providers: [ProblemService],
})
export class ProblemModule {}
