import { Group } from '@entities/group.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupRepository {
  constructor(
    @Inject('GROUP_MODEL')
    private readonly groupModel: Model<Group>,
  ) {}

  create(createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupModel.create(createGroupDto);
  }

  getAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async get(groupId: string): Promise<Group> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Group not found: ${groupId}`);
    }
    return group;
  }

  validate(groupId: string, group: Group): void {
    if (!group) {
      throw new NotFoundException(`Group not found: ${groupId}`);
    }
  }

  deleteAll() {
    return this.groupModel.deleteMany().exec();
  }

  async update(groupId: string, group: Group): Promise<Group> {
    const updatedGroup = await this.groupModel.findByIdAndUpdate(groupId, group, { new: true });
    if (!updatedGroup) {
      throw new NotFoundException(`Group not found: ${groupId}`);
    }

    return updatedGroup;
  }
}
