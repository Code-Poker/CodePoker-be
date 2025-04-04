import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';

import { GroupController } from './controller';
import { groupProviders } from './providers';
import { GroupRepository } from './repository';
import { GroupService } from './service';

@Module({
  imports: [DatabaseModule],
  controllers: [GroupController],
  providers: [GroupService, ...groupProviders, GroupRepository],
  exports: [GroupService],
})
export class GroupModule {}
