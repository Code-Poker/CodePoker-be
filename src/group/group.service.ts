import { Injectable } from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    return (await this.groupRepository.create(createGroupDto)) as Group;
  }

  async getAll(): Promise<Group[]> {
    return (await this.groupRepository.getAll()) as Group[];
  }

  async get(groupId: string): Promise<Group> {
    return (await this.groupRepository.get(groupId)) as Group;
  }

  deleteAll() {
    return this.groupRepository.deleteAll();
  }
}
