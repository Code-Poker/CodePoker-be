import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProblemService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('REDIS') private readonly redis: RedisClientType,
  ) {}

  async refresh(problemId: string) {
    const problem = await this.getProblemFromSolved(problemId);

    const wellKnownProblems = await this.redis.json.get('wellKnownProblems');
    wellKnownProblems[problemId] = problem;

    await this.redis.json.set('wellKnownProblems', '.', wellKnownProblems);
  }

  async getProblemFromSolved(problemId: string) {
    const url = `https://solved.ac/api/v3/problem/show?problemId=${problemId}`;
    return await this.httpService.axiosRef.get(url).then((res) => res.data);
  }
}
