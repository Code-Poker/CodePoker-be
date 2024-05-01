import { Injectable } from '@nestjs/common';

import { BojRepository } from './boj.repository';
import { ContestList } from './entities/contest.entity';

@Injectable()
export class BojService {
  constructor(private readonly bojRepository: BojRepository) {}

  async getUserProblems(handle: string) {
    return await this.bojRepository.getUserProblems(handle);
  }

  async getContests() {
    const contests: ContestList = new ContestList();
    contests.endedContests = await this.bojRepository.getEndedContests();
    contests.ongoingContests = await this.bojRepository.getOngoingContests();
    contests.upcomingContests = await this.bojRepository.getUpcomingContests();

    return contests;
  }

  async getSSUInfo() {
    return await this.bojRepository.getSSUInfo();
  }

  async getSSURanking(page: number) {
    return await this.bojRepository.getSSURanking(page);
  }
}
