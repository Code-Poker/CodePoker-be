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

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    return Group.fromDocument(await this.groupModel.create(createGroupDto));
  }

  async getAll(): Promise<Group[]> {
    const groupDocs = await this.groupModel.find().exec();
    if (!groupDocs) {
      throw new NotFoundException('No groups found');
    }

    return groupDocs.map((document) => Group.fromDocument(document));
  }

  async get(groupId: string): Promise<Group> {
    const groupDoc = await this.groupModel.findById(groupId);
    if (!groupDoc) {
      throw new NotFoundException(`Group not found: ${groupId}`);
    }

    return Group.fromDocument(groupDoc);
  }

  deleteAll() {
    return this.groupModel.deleteMany().exec();
  }

  async update(groupId: string, group: Group): Promise<Group> {
    const updatedGroup = await this.groupModel.findByIdAndUpdate(groupId, group, { new: true });
    if (!updatedGroup) {
      throw new NotFoundException(`Group not found: ${groupId}`);
    }

    return Group.fromDocument(updatedGroup);
  }
}
