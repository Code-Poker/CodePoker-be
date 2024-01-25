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

    const result = await this.pokerService.calc(recentPokerId);
    let resultHtml = `
    <h1>${result.name} 포커 결과</h1>
    <h3>${result.createdAt}</h3>`;
    for (const user in result.result) {
      resultHtml += `<h2>${user}</h2>`;
      resultHtml += `<p>${result.result[user]}</p>`;
    }

    return resultHtml;
  }
}
