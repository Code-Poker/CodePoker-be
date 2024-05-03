import { Injectable } from '@nestjs/common';

import { SolvedRepository } from './solved.repository';

@Injectable()
export class SolvedService {
  constructor(private readonly solvedRepository: SolvedRepository) {}

  async getSSUInfo() {
    return await this.solvedRepository.getSSUInfo();
  }

  async getSSUProblems(
    solved: string,
    page: number,
    sort: string,
    direction: string,
  ) {
    return await this.solvedRepository.getSSUProblems(
      solved,
      page,
      sort,
      direction,
    );
  }

  async getSSUSolvedRanking(page: number) {
    return await this.solvedRepository.getSSUSolvedRanking(page);
  }

  async getSSUAreaRanking(page: number) {
    return await this.solvedRepository.getSSUAreaRanking(page);
  }
}
