import { DatabaseModule } from '@database/database.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UserController } from './controller';
import { UserService } from './service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
