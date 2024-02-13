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
    const problems = await this.getProblemsFromBoj(handle);
    return {
      handle,
      problems,
    };
  }

  async calcScore(pokerId: string, handle: string) {
    const poker = await this.redis.json.get(pokerId);
    if (poker === undefined) {
      throw new Error('포커가 존재하지 않습니다.');
    }

    if (poker['participants'][handle] === undefined) {
      throw new Error('참가하지 않은 유저입니다.');
    }

    const user = poker['participants'][handle];
    const goal = user['goal'];
    const acientProblems = user['problems'];
    const recentProblems = await this.getProblemsFromBoj(handle);

    const solved = [];
    for (const problem of recentProblems) {
      if (!acientProblems.includes(problem)) {
        solved.push(problem);
      }
    }

    const solvedProblems = await this.getProblemsFromSolved(solved);
    const point = solvedProblems.reduce((acc, cur) => acc + cur['level'], 0);
    return {
      handle,
      profileImage: user['profileImage'],
      goal,
      point,
      problems: solvedProblems.map((problem) => {
        return {
          id: problem['problemId'],
          title: problem['titleKo'],
          level: problem['level'],
        };
      }),
    };
  }

  public async getProblemsFromBoj(handle: string) {
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

    return response('.col-md-9 > div:nth-child(2) > div:nth-child(2)')
      .text()
      .trim()
      .split(' ')
      .map((problem) => parseInt(problem));
  }

  async getProblemsFromSolved(problemIds: number[]) {
    const problems = [];

    for (let page = 1; page <= (problemIds.length + 49) / 50; page++) {
      let url = `https://solved.ac/api/v3/search/problem?query=`;
      for (
        let i = (page - 1) * 50;
        i < page * 50 && i < problemIds.length;
        i++
      ) {
        url = url.concat('id:' + problemIds[i] + '|');
      }

      const response = await this.httpService.axiosRef
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(
            err?.message + ': ' + JSON.stringify(err?.response?.data),
          );
        });

      for (const problem of response['items']) {
        problem['level'] = this.levelToPoint(problem['level']);
        problems.push(problem);
      }
    }

    return problems;
  }

  async getProfileImageFromSolved(handle: string) {
    const url = `https://solved.ac/api/v3/user/show?handle=${handle}`;

    return (
      (await this.httpService.axiosRef
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(
            err?.message + ': ' + JSON.stringify(err?.response?.data),
          );
        })
        .then((res) => res['profileImageUrl'])) ??
      'https://static.solved.ac/misc/default_profile.png'
    );
  }

  private levelToPoint(level: number) {
    switch (level) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 5;
      case 6:
        return 7;
      case 7:
        return 9;
      case 8:
        return 11;
      case 9:
        return 13;
      case 10:
        return 15;
      case 11:
        return 21;
      case 12:
        return 27;
      case 13:
        return 33;
      case 14:
        return 39;
      case 15:
        return 45;
      case 16:
        return 60;
      case 17:
        return 75;
      case 18:
        return 90;
      case 19:
        return 105;
      case 20:
        return 120;
      case 21:
        return 159;
      case 22:
        return 198;
      case 23:
        return 237;
      case 24:
        return 276;
      case 25:
        return 315;
      case 26:
        return 412;
      case 27:
        return 509;
      case 28:
        return 606;
      case 29:
        return 703;
      case 30:
        return 800;
      default:
        return 0;
    }
  }
}
