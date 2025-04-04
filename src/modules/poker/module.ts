import { DatabaseModule } from '@database/database.module';
import { ProblemService } from '@modules/problem/service';
import { UserService } from '@modules/user/service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { groupProviders } from '../group/providers';
import { GroupRepository } from '../group/repository';
import { PokerController } from './controller';
import { pokerProviders } from './providers';
import { PokerRepository } from './repository';
import { PokerService } from './service';

@Module({
  controllers: [PokerController],
  exports: [PokerService],
  imports: [DatabaseModule, HttpModule, ScheduleModule.forRoot()],
  providers: [
    PokerService,
    UserService,
    ...pokerProviders,
    PokerRepository,
    ...groupProviders,
    GroupRepository,
    ProblemService,
  ],
})
export class PokerModule {}
