import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Problem')
@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get(':problemId/refresh')
  async refresh(@Param('problemId') problemId: string) {
    return this.problemService.refresh(problemId);
  }

  @Post('getIdsByQuery')
  @ApiQuery({ name: 'query', description: '문제 검색어' })
  async getIdsByQuery(@Query('query') query: string) {
    return this.problemService.getIdsByQuery(query);
  }
}
