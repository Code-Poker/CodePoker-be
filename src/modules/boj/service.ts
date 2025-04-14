import { Contest } from '@entities/contest.entity';
import { Injectable } from '@nestjs/common';

import { BojRepository } from './repository';

@Injectable()
export class BojService {
  constructor(private readonly bojRepository: BojRepository) {}

  async getUserProblems(handle: string) {
    return await this.bojRepository.getUserProblems(handle);
  }

  async getContests() {
    const baechu = await this.bojRepository.getBaechu();

    const contests = await this.bojRepository.getContestsFromCList();

    const bojContests = await this.bojRepository.getContestsFromBoj();
    for (const contest of bojContests.upcoming) {
      contests.upcoming.push(this.adjustBojContestBaechu(contest, baechu));
    }
    for (const contest of bojContests.ended) {
      contests.ended.push(this.adjustBojContestBaechu(contest, baechu));
    }
    for (const contest of bojContests.ongoing) {
      contests.ongoing.push(this.adjustBojContestBaechu(contest, baechu));
    }

    contests.upcoming.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    contests.ended.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
    contests.ongoing.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return contests;
  }

  getSSUInfo() {
    return this.bojRepository.getSSUInfo();
  }

  async getSSURanking(page: number) {
    return await this.bojRepository.getSSURanking(page);
  }

  private adjustBojContestBaechu(contest: Contest, baechu: Record<string, { badge: string; background: string }>) {
    if (contest.venue !== 'BOJ Open' || !contest.url) {
      return contest;
    }

    const contestId = contest.url.split('/').pop();
    if (contestId === undefined) return contest;

    contest.badge = baechu[contestId]?.badge;
    contest.background = baechu[contestId]?.background;

    return contest;
  }
}
