import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { SsuService } from './ssu.service';

@ApiTags('SSU')
@Controller('ssu')
export class SsuController {
  constructor(private readonly ssuService: SsuService) {}

  @Get('info')
  async info() {
    return this.ssuService.info();
  }

  @Get('solvedProblems')
  @ApiQuery({
    required: false,
    name: 'solved',
    description: '푼 문제만 보기',
  })
  @ApiQuery({
    required: false,
    name: 'direction',
    description: '정렬 방향',
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    required: false,
    name: 'page',
    description: '페이지 번호',
  })
  @ApiQuery({
    required: false,
    name: 'sort',
    description: '정렬 기준',
    enum: ['id', 'level', 'title', 'solved', 'average_try', 'random'],
  })
  async solvedProblems(
    @Query('solved') solved: boolean = true,
    @Query('direction') direction: string = 'asc',
    @Query('page') page: number = 1,
    @Query('sort') sort: string = 'id',
  ) {
    return this.ssuService.solvedProblems(solved, direction, page, sort);
  }

  @Get('ranking/solved')
  @ApiQuery({
    required: false,
    name: 'page',
    description: '페이지 번호',
  })
  async solvedRanking(@Query('page') page: number = 1) {
    return this.ssuService.solvedRanking(page);
  }

  @Get('ranking/arena')
  @ApiQuery({
    required: false,
    name: 'page',
    description: '페이지 번호',
  })
  async arenaRanking(@Query('page') page: number = 1) {
    return this.ssuService.arenaRanking(page);
  }

  @Get('ranking/boj')
  @ApiQuery({
    required: false,
    name: 'page',
    description: '페이지 번호',
  })
  async bojRanking(@Query('page') page: number = 1) {
    return this.ssuService.bojRanking(page);
  }
}
