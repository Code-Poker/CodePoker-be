import { Injectable } from '@nestjs/common';

import { BojService } from '../boj/boj.service';
import { SolvedService } from '../solved/solved.service';

@Injectable()
export class SsuService {
  constructor(
    private readonly bojService: BojService,
    private readonly solvedService: SolvedService,
  ) {}

  async info() {
    const { bojUserCount, bojRank, bojSolvedCount, bojSubmitCount } = await this.bojService.getSSUInfo();
    const ssuInfo = await this.solvedService.getSSUInfo();

    return {
      bojUserCount,
      bojRank,
      bojSolvedCount,
      bojSubmitCount,
      ...ssuInfo,
    };
  }

  async solvedProblems(solved: string, page: number, sort: string, direction: string) {
    return await this.solvedService.getSSUProblems(solved, page, sort, direction);
  }

  async solvedRanking(page: number) {
    return await this.solvedService.getSSUSolvedRanking(page);
  }

  async arenaRanking(page: number) {
    return await this.solvedService.getSSUAreaRanking(page);
  }

  async bojRanking(page: number) {
    return await this.bojService.getSSURanking(page);
  }
}
