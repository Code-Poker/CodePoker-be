import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { SolvedService } from './service';

@ApiTags('solved')
@Controller('solved')
export class SolvedController {
  constructor(private readonly solvedService: SolvedService) {}

  @Get('user/show')
  @ApiQuery({
    name: 'handle',
  })
  userShow(@Query('handle') handle: string) {
    return this.solvedService.userShow(handle);
  }

  @Get('user/organizations')
  @ApiQuery({
    name: 'handle',
  })
  userOrganizations(@Query('handle') handle: string) {
    return this.solvedService.userOrganizations(handle);
  }

  @Get('user/available_badges')
  @ApiQuery({
    name: 'handle',
  })
  userAvailableBadges(@Query('handle') handle: string) {
    return this.solvedService.userAvailableBadges(handle);
  }

  @Get('user/grass')
  @ApiQuery({
    name: 'handle',
  })
  @ApiQuery({
    name: 'topic',
    required: false,
  })
  userGrass(@Query('handle') handle: string, @Query('topic') topic: string = 'default') {
    return this.solvedService.userGrass(handle, topic);
  }

  @Get('user/top_100')
  @ApiQuery({
    name: 'handle',
  })
  userTop100(@Query('handle') handle: string) {
    return this.solvedService.userTop100(handle);
  }

  @Get('user/problem_stats')
  @ApiQuery({
    name: 'handle',
  })
  userProblemStats(@Query('handle') handle: string) {
    return this.solvedService.userProblemStats(handle);
  }

  @Get('user/tag_ratings')
  @ApiQuery({
    name: 'handle',
  })
  userTagRatings(@Query('handle') handle: string) {
    return this.solvedService.userTagRatings(handle);
  }

  @Get('background/show')
  @ApiQuery({
    name: 'backgroundId',
  })
  backgroundShow(@Query('backgroundId') backgroundId: string) {
    return this.solvedService.backgroundShow(backgroundId);
  }

  @Get('badge/show')
  @ApiQuery({
    name: 'badgeId',
  })
  badgeShow(@Query('badgeId') badgeId: string) {
    return this.solvedService.badgeShow(badgeId);
  }

  @Get('search/suggestion')
  @ApiQuery({
    name: 'query',
  })
  searchSuggestion(@Query('query') query: string) {
    return this.solvedService.searchSuggestion(query);
  }

  @Get('search/problem')
  @ApiQuery({
    name: 'query',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
  })
  @ApiQuery({
    name: 'direction',
    required: false,
  })
  @ApiQuery({
    name: 'seed',
    required: false,
  })
  searchProblem(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('sort') sort: string = 'solved',
    @Query('direction') direction: string = 'descending',
    @Query('seed') seed: string = '',
  ) {
    return this.solvedService.searchProblem(query, page, sort, direction, seed);
  }

  @Get('search/user')
  @ApiQuery({
    name: 'query',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  searchUser(@Query('query') query: string, @Query('page') page: number = 1) {
    return this.solvedService.searchUser(query, page);
  }

  @Get('search/tag')
  @ApiQuery({
    name: 'query',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  searchTag(@Query('query') query: string, @Query('page') page: number = 1) {
    return this.solvedService.searchTag(query, page);
  }

  @Get('site/stats')
  siteStats() {
    return this.solvedService.siteStats();
  }
}
