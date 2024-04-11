import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { GroupController } from './group.controller';
import { groupProviders } from './group.providers';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GroupController],
  providers: [GroupService, ...groupProviders, GroupRepository],
  exports: [GroupService],
})
export class GroupModule {}
