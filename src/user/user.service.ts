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
    const acientProblems = new Set(user['problems']);
    const recentProblems = await this.getProblemsFromBoj(handle);

    const tasks = poker['tasks'];
    const solvedTasks = [];
    const solved = [];
    for (const problem of recentProblems) {
      if (tasks.includes(problem)) {
        solvedTasks.push(problem);
        continue;
      }

      if (!acientProblems.has(problem)) {
        solved.push(problem);
      }
    }

    const solvedProblems = await this.getProblemsFromSolved(solved);
    const point = solvedProblems.reduce(
      (acc, cur) => acc + this.levelToPoint(cur['level']),
      0,
    );
    return {
      handle,
      profileImage: user['profileImage'],
      point,
      tasks: await this.getProblemsFromSolved(solvedTasks).then((problems) =>
        problems.map((problem) => {
          return {
            id: problem['problemId'],
            title: problem['titleKo'],
            level: this.levelToPoint(problem['level']),
          };
        }),
      ),
      problems: solvedProblems.map((problem) => {
        return {
          id: problem['problemId'],
          title: problem['titleKo'],
          level: this.levelToPoint(problem['level']),
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
    const notKnownProblemsIds = [];

    const wellKnownJson = await this.redis.json.get('wellKnownProblems');
    for (const problemId of problemIds) {
      if (wellKnownJson[problemId] !== undefined) {
        problems.push(wellKnownJson[problemId]);
      } else {
        notKnownProblemsIds.push(problemId);
      }
    }

    for (let page = 1; page <= (notKnownProblemsIds.length + 49) / 50; page++) {
      let url = `https://solved.ac/api/v3/search/problem?query=`;
      for (
        let i = (page - 1) * 50;
        i < page * 50 && i < notKnownProblemsIds.length;
        i++
      ) {
        url = url.concat('id:' + notKnownProblemsIds[i] + '|');
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
        wellKnownJson[problem['problemId']] = problem;
        problems.push(problem);
      }
    }

    await this.redis.json.set('wellKnownProblems', '.', wellKnownJson);
    problems.sort((a, b) => a['problemId'] - b['problemId']);
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
    return level;
  }
}
