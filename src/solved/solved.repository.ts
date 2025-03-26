import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SolvedRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getSSUInfo() {
    const url = `https://solved.ac/api/v3/organization/show`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          organizationId: 323,
        },
      })
      .then((res) => res.data);
  }

  async getSSUProblems(solved: string, page: number, sort: string, direction: string) {
    const url = `https://solved.ac/api/v3/search/problem`;
    const query = solved === 'true' ? 'o@ssu' : '!o@ssu';
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          query,
          page,
          sort,
          direction,
        },
        headers: {
          Cookie: this.configService.get<string>('SOLVEDAC_TOKEN'),
        },
      })
      .then((res) => res.data);
  }

  async getSSUSolvedRanking(page: number) {
    const url = `https://solved.ac/api/v3/ranking/in_organization`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          organizationId: 323,
          page,
        },
      })
      .then((res) => res.data);
  }

  async getSSUAreaRanking(page: number) {
    const url = `https://solved.ac/api/v3/ranking/in_organization`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          organizationId: 323,
          page,
          type: 'area',
        },
      })
      .then((res) => res.data);
  }

  async userShow(handle: string) {
    const url = `https://solved.ac/api/v3/user/show`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          handle: handle,
        },
      })
      .then((res) => res.data);
  }

  async userOrganizations(handle: string) {
    const url = `https://solved.ac/api/v3/user/organizations`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          handle: handle,
        },
      })
      .then((res) => res.data);
  }

  async userAvailableBadges(handle: string) {
    const url = `https://solved.ac/api/v3/user/available_badges`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          handle: handle,
        },
      })
      .then((res) => res.data);
  }

  async userGrass(handle: string, topic: string) {
    const url = `https://solved.ac/api/v3/user/grass`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          handle: handle,
          topic: topic,
        },
      })
      .then((res) => res.data);
  }

  async userTop100(handle: string) {
    const url = `https://solved.ac/api/v3/user/top_100`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          handle: handle,
        },
      })
      .then((res) => res.data);
  }

  async userProblemStats(handle: string) {
    const url = `https://solved.ac/api/v3/user/problem_stats`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          handle: handle,
        },
      })
      .then((res) => res.data);
  }

  async userTagRatings(handle: string) {
    const url = `https://solved.ac/api/v3/user/tag_ratings`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          handle: handle,
        },
      })
      .then((res) => res.data);
  }

  async backgroundShow(backgroundId: string) {
    const url = `https://solved.ac/api/v3/background/show`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          backgroundId: backgroundId,
        },
      })
      .then((res) => res.data);
  }

  async badgeShow(badgeId: string) {
    const url = `https://solved.ac/api/v3/badge/show`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          badgeId: badgeId,
        },
      })
      .then((res) => res.data);
  }

  async searchSuggestion(query: string) {
    const url = `https://solved.ac/api/v3/search/suggestion`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          query: query,
        },
      })
      .then((res) => res.data);
  }

  async searchProblem(query: string, page: number, sort: string, direction: string, seed: string) {
    const url = `https://solved.ac/api/v3/search/problem`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          query: query,
          page: page,
          sort: sort,
          direction: direction,
          seed: seed,
        },
      })
      .then((res) => res.data);
  }

  async searchUser(query: string, page: number) {
    const url = `https://solved.ac/api/v3/search/user`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          query: query,
          page: page,
        },
      })
      .then((res) => res.data);
  }

  async searchTag(query: string, page: number) {
    const url = `https://solved.ac/api/v3/search/tag`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          query: query,
          page: page,
        },
      })
      .then((res) => res.data);
  }

  async siteStats() {
    const url = `https://solved.ac/api/v3/site/stats`;
    return await this.httpService.axiosRef.get(url).then((res) => res.data);
  }
}
