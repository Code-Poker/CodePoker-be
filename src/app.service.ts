import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { PokerService } from './poker/poker.service';

@Injectable()
export class AppService {
  constructor(
    private readonly pokerService: PokerService,
    @Inject('REDIS') private readonly redisClient: RedisClientType,
  ) {}

  async getRecentPokerResult() {
    const recentPokerId = await this.redisClient.get('recent');
    if (!recentPokerId) {
      return {
        result: '존재하지 않는 포커입니다.',
      };
    }
    return await this.pokerService.calc(recentPokerId);
  }
}
