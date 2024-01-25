import { Module } from '@nestjs/common';
import { PokerService } from './poker.service';
import { PokerController } from './poker.controller';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../user/user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [PokerController],
  providers: [PokerService, UserService],
})
export class PokerModule {}
