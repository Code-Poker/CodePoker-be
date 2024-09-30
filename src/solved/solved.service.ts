import { Injectable } from '@nestjs/common';

import { SolvedRepository } from './solved.repository';

@Injectable()
export class SolvedService {
  constructor(private readonly solvedRepository: SolvedRepository) {}

  async getSSUInfo() {
    return await this.solvedRepository.getSSUInfo();
  }

  async getSSUProblems(solved: string, page: number, sort: string, direction: string) {
    return await this.solvedRepository.getSSUProblems(solved, page, sort, direction);
  }

  async getSSUSolvedRanking(page: number) {
    return await this.solvedRepository.getSSUSolvedRanking(page);
  }

  async getSSUAreaRanking(page: number) {
    return await this.solvedRepository.getSSUAreaRanking(page);
  }

  async userShow(handle: string) {
    return await this.solvedRepository.userShow(handle);
  }

  async userOrganizations(handle: string) {
    return await this.solvedRepository.userOrganizations(handle);
  }

  async userAvailableBadges(handle: string) {
    return await this.solvedRepository.userAvailableBadges(handle);
  }

  async userGrass(handle: string, topic: string) {
    return await this.solvedRepository.userGrass(handle, topic);
  }

  async userTop100(handle: string) {
    return await this.solvedRepository.userTop100(handle);
  }

  async userProblemStats(handle: string) {
    return await this.solvedRepository.userProblemStats(handle);
  }

  async userTagRatings(handle: string) {
    return await this.solvedRepository.userTagRatings(handle);
  }

  async backgroundShow(backgroundId: string) {
    return await this.solvedRepository.backgroundShow(backgroundId);
  }

  async badgeShow(badgeId: string) {
    return await this.solvedRepository.badgeShow(badgeId);
  }

  async searchSuggestion(query: string) {
    return await this.solvedRepository.searchSuggestion(query);
  }

  async searchProblem(query: string, page: number, sort: string, direction: string) {
    return await this.solvedRepository.searchProblem(query, page, sort, direction);
  }

  async searchUser(query: string, page: number) {
    return await this.solvedRepository.searchUser(query, page);
  }

  async searchTag(query: string, page: number) {
    return await this.solvedRepository.searchTag(query, page);
  }

  async siteStats() {
    return await this.solvedRepository.siteStats();
  }
}
