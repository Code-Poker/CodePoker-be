import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from '../database/database.module';
import { groupProviders } from '../group/group.providers';
import { GroupRepository } from '../group/group.repository';
import { ProblemService } from '../problem/problem.service';
import { UserService } from '../user/user.service';
import { PokerController } from './poker.controller';
import { pokerProviders } from './poker.providers';
import { PokerRepository } from './poker.repository';
import { PokerService } from './poker.service';

@Module({
  imports: [DatabaseModule, HttpModule, ScheduleModule.forRoot()],
  controllers: [PokerController],
  providers: [
    PokerService,
    UserService,
    ...pokerProviders,
    PokerRepository,
    ...groupProviders,
    GroupRepository,
    ProblemService,
  ],
  exports: [PokerService],
})
export class PokerModule {}
