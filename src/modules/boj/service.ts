import { ContestList } from '@entities/contest.entity';
import { Injectable } from '@nestjs/common';

import { BojRepository } from './repository';

@Injectable()
export class BojService {
  constructor(private readonly bojRepository: BojRepository) {}

  async getUserProblems(handle: string) {
    return await this.bojRepository.getUserProblems(handle);
  }

  async getContests() {
    const contests: ContestList = new ContestList();
    const baechu = await this.bojRepository.getBaechu();

    contests.ended = await this.bojRepository.getEndedContests();
    for (const contest of contests.ended) {
      if (contest.venue !== 'BOJ Open' || !contest.url) {
        continue;
      }

      if (!contest.url.includes('/')) {
        continue;
      }
      const contestId = contest.url.split('/').pop();
      if (contestId === undefined) continue;
      contest.badge = baechu[contestId]?.badge;
      contest.background = baechu[contestId]?.background;
    }

    contests.ongoing = await this.bojRepository.getOngoingContests();
    for (const contest of contests.ongoing) {
      if (contest.venue !== 'BOJ Open' || !contest.url) {
        continue;
      }

      const contestId = contest.url.split('/').pop();
      if (contestId === undefined) continue;
      contest.badge = baechu[contestId]?.badge;
      contest.background = baechu[contestId]?.background;
    }

    contests.upcoming = await this.bojRepository.getUpcomingContests();
    for (const contest of contests.upcoming) {
      if (contest.venue !== 'BOJ Open' || !contest.url) {
        continue;
      }

      const contestId = contest.url.split('/').pop();
      if (contestId === undefined) continue;
      contest.badge = baechu[contestId]?.badge;
      contest.background = baechu[contestId]?.background;
    }

    return contests;
  }

  getSSUInfo() {
    return this.bojRepository.getSSUInfo();
  }

  async getSSURanking(page: number) {
    return await this.bojRepository.getSSURanking(page);
  }
}
