import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { BojService } from './service';

@ApiTags('BOJ')
@Controller('boj')
export class BojController {
  constructor(private readonly bojService: BojService) {}

  @Get('user/:handle/problems')
  @ApiParam({ name: 'handle', description: 'BOJ user handle' })
  async getUserProblems(@Param('handle') handle: string) {
    return await this.bojService.getUserProblems(handle);
  }

  @Get('contests')
  async getContests() {
    return await this.bojService.getContests();
  }
}
