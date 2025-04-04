import { Group } from '@entities/group.entity';
import { Injectable } from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupRepository } from './repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupRepository.create(createGroupDto);
  }

  async getAll(): Promise<Group[]> {
    return await this.groupRepository.getAll();
  }

  async get(groupId: string): Promise<Group> {
    return await this.groupRepository.get(groupId);
  }

  deleteAll() {
    return this.groupRepository.deleteAll();
  }
}
