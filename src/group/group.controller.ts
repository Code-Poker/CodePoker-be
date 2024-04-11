import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  async getAll() {
    return this.groupService.getAll();
  }

  @Get(':groupId')
  async getOne(@Param('groupId') groupId: string) {
    return this.groupService.get(groupId);
  }

  @Delete()
  async deleteAll() {
    return this.groupService.deleteAll();
  }
}
