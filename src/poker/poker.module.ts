import { Module } from '@nestjs/common';
import { PokerService } from './poker.service';
import { PokerController } from './poker.controller';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../user/user.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, HttpModule, ScheduleModule.forRoot()],
  controllers: [PokerController],
  providers: [PokerService, UserService],
  exports: [PokerService],
})
export class PokerModule {}
