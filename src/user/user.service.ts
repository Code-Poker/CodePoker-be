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

  async calcScore(pokerId: string, handle: string) {
    const poker = await this.redis.json.get(pokerId);
    const result = {
      result: {},
    };

    if (poker['userInfos'][handle] === undefined) {
      throw new Error('참가하지 않은 유저입니다.');
    }

    const point = poker['userInfos'][handle]['point'];
    const acientProblems = poker['userInfos'][handle]['problems'];
    const recentProblems = await this.getProblemsByHandle(handle);

    const solved = [];
    for (const problem of recentProblems) {
      if (!acientProblems.includes(problem)) {
        solved.push(problem);
      }
    }

    const solvedPoint = await this.calcPointFromSolved(solved);
    result['result'][handle] = `${solvedPoint} / ${point}`;

    return result;
  }

  public async getProblemsByHandle(handle: string) {
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

  async calcPointFromSolved(problems: number[]) {
    let point = 0;
    for (let page = 1; page <= (problems.length + 49) / 50; page++) {
      let url = `https://solved.ac/api/v3/search/problem?page=${page}&query=`;
      for (let i = (page - 1) * 50; i < page * 50; i++) {
        if (i >= problems.length) {
          break;
        }
        url = url.concat('id:' + problems[i] + '|');
      }
      console.log(url);

      const response = await this.httpService.axiosRef
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(
            err?.message + ': ' + JSON.stringify(err?.response?.data),
          );
        });

      for (const problem of response['items']) {
        point += Number(problem['level']);
      }
    }
    return point;
  }
}
