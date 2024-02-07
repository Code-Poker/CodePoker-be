import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly appService: AppService,
  ) {}

  @ApiExcludeEndpoint()
  @Get()
  getRecentPokerResult() {
    return this.appService.getRecentPokerResult();
  }
}
