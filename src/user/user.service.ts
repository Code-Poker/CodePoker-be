import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('REDIS') private readonly redis: RedisClientType,
  ) {}

  async getBojInfoByHandle(handle: string) {
    const problems = await this.getProblemsByHandle(handle);
    return {
      handle,
      problems,
    };
  }

  async setUser(handle: string) {
    const problems = await this.getProblemsByHandle(handle);
    await this.redis.json.set(handle, '.', {
      updatedAt: new Date(),
      problems,
    });
  }

  async getUser(handle: string) {
    return await this.redis.json.get(handle);
  }

  private async getProblemsByHandle(handle: string) {
    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(`https://www.acmicpc.net/user/${handle}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(
            err?.message + ': ' + JSON.stringify(err?.response?.data),
          );
        }),
    );

    return response('.panel-body')
      .text()
      .trim()
      .split(' ')
      .map((problem) => {
        return Number(problem);
      });
  }
}
