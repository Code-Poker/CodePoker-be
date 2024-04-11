import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateGroupDto } from './dto/create-group.dto';
import { IGroup } from './interfaces/group.interface';

@Injectable()
export class GroupRepository {
  constructor(
    @Inject('GROUP_MODEL')
    private readonly groupModel: Model<IGroup>,
  ) {}

  create(createGroupDto: CreateGroupDto): Promise<IGroup> {
    return this.groupModel.create(createGroupDto);
  }

  getAll(): Promise<IGroup[]> {
    return this.groupModel.find().exec();
  }

  get(groupId: string): Promise<IGroup> {
    return this.groupModel.findById(groupId);
  }

  validate(groupId: string, group: IGroup): void {
    if (!group) {
      throw new NotFoundException(`Group not found: ${groupId}`);
    }
  }

  deleteAll() {
    return this.groupModel.deleteMany().exec();
  }

  update(groupId: string, group: IGroup): Promise<IGroup> {
    return this.groupModel.findByIdAndUpdate(groupId, group, { new: true });
  }
}
