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
}
