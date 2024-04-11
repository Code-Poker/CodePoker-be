import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cheerio from 'cheerio';

@Injectable()
export class SsuService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async info() {
    const bojUrl = `https://www.acmicpc.net/ranklist/school`;
    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(bojUrl, {
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

    let bojUserCount: number;
    for (let rank = 1; rank <= 100; rank++) {
      const school = response(
        `#ranklist > tbody > tr:nth-child(${rank}) > td:nth-child(2)`,
      ).text();

      if (school === '숭실대학교') {
        bojUserCount = parseInt(
          response(
            `#ranklist > tbody > tr:nth-child(${rank}) > td:nth-child(3)`,
          ).text(),
        );
        break;
      }
    }

    const solvedUrl = `https://solved.ac/api/v3/organization/show`;
    return await this.httpService.axiosRef
      .get(solvedUrl, {
        params: {
          organizationId: 323,
        },
      })
      .then((res) => {
        return {
          bojUserCount,
          ...res.data,
        };
      });
  }

  async solvedProblems(
    solved: boolean,
    direction: string,
    page: number,
    sort: string,
  ) {
    const url = `https://solved.ac/api/v3/search/problem`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          query: solved ? 'o@ssu' : '!o@ssu',
          direction,
          page,
          sort,
        },
        headers: {
          Cookie: this.configService.get<string>('SOLVEDAC_TOKEN'),
        },
      })
      .then((res) => res.data)
      .then((data) =>
        data['items'].map(
          (problem: { [x: string]: any }) => problem['problemId'],
        ),
      );
  }

  async solvedRanking(page: number) {
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

  async arenaRanking(page: number) {
    const url = `https://solved.ac/api/v3/ranking/arena_in_organization`;
    return await this.httpService.axiosRef
      .get(url, {
        params: {
          organizationId: 323,
          page,
        },
      })
      .then((res) => res.data);
  }

  async bojRanking(page: number) {
    const url =
      `https://www.acmicpc.net/school/ranklist/323/` + Math.ceil(page / 2);
    console.log(url);

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(url, {
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

    const users = [];
    for (let rank = 1; rank <= 50; rank++) {
      const user = response(
        `#ranklist > tbody > tr:nth-child(${page % 2 ? rank : rank + 50}) > td:nth-child(2) > a`,
      ).text();
      if (user === '') {
        break;
      }
      users.push(user);
    }

    return users;
  }
}
