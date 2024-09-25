import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { BojService } from './boj.service';

@ApiTags('BOJ')
@Controller('boj')
export class BojController {
  constructor(private readonly bojService: BojService) {}

  @Get('user/:handle/problems')
  @ApiQuery({ name: 'key', description: 'json key by', required: false, enum: ['problemId', 'type'] })
  @ApiParam({ name: 'handle', description: 'BOJ user handle' })
  async getUserProblems(@Param('handle') handle: string, @Query('key') key: string = 'type') {
    return await this.bojService.getUserProblems(handle, key);
  }

  @Get('contests')
  async getContests() {
    return await this.bojService.getContests();
  }
}
