import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cheerio from 'cheerio';
import { Cheerio } from 'cheerio';
import { AnyNode } from 'domhandler';
import * as process from 'node:process';

import { Contest } from './entities/contest.entity';

@Injectable()
export class BojRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getUserProblems(handle: string) {
    const url = `https://www.acmicpc.net/user/${handle}`;

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get<string>(url, {
          headers: {
            'User-Agent': this.configService.get<string>('BOJ_USER_AGENT'),
          },
        })
        .then((res) => res.data),
    );

    const problems: Record<string, number[]> = {
      solved: [],
      tried: [],
      extra: [],
    };

    const panels = response('.panel.panel-default');
    for (let i = 0; i < panels.length; i++) {
      const title = panels.eq(i).find('.panel-title').text();
      const panelType = {
        '맞은 문제': 'solved',
        '맞았지만 만점을 받지 못한 문제': 'tried',
        '시도했지만 맞지 못한 문제': 'tried',
        '맞은 번외 문제': 'extra',
      }[title];
      if (!panelType || !Object.hasOwn(problems, panelType)) {
        continue;
      }

      const rows = panels.eq(i).find('.problem-list > a');
      for (let j = 0; j < rows.length; j++) {
        const problemId = parseInt(panels.eq(j).text());
        problems[panelType].push(problemId);
      }
    }

    return problems;
  }

  async getEndedContests(): Promise<Contest[]> {
    const endedUrl = 'https://www.acmicpc.net/contest/official/list';

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get<string>(endedUrl, {
          headers: {
            'User-Agent': this.configService.get<string>('BOJ_USER_AGENT'),
          },
        })

        .then((res) => res.data),
    );

    const contests: Contest[] = [];

    const rows = response(
      'body > div.wrapper > div.container.content > div.row > div:nth-child(2) > div > table > tbody > tr',
    );
    for (let i = 0; i < rows.length; i++) {
      if (rows.eq(i).find('td:nth-child(6)').text() !== '종료') {
        continue;
      }

      const venue = 'BOJ Open';
      const name = rows.eq(i).find('td:nth-child(1) > a').text();
      const url = 'https://www.acmicpc.net' + rows.eq(i).find('td:nth-child(1) > a').attr('href');
      const startDate = new Date(
        1000 * parseInt(<string>rows.eq(i).find('td:nth-child(4) > span').attr('data-timestamp')),
      ).toISOString();
      const endDate = new Date(
        1000 * parseInt(<string>rows.eq(i).find('td:nth-child(5) > span').attr('data-timestamp')),
      ).toISOString();

      contests.push(new Contest(venue, name, url, startDate, endDate));
    }

    return contests;
  }

  async getOngoingContests(): Promise<Contest[]> {
    const response = await this.otherResponse();

    if (response('.col-md-12').length < 6) {
      return [];
    }

    return this.contestsFromOther(response, 3);
  }

  async getUpcomingContests(): Promise<Contest[]> {
    const response = await this.otherResponse();

    const rowIndex = response('.col-md-12').length === 6 ? 5 : 3;

    return this.contestsFromOther(response, rowIndex);
  }

  async getSSUInfo() {
    const bojUrl = `https://www.acmicpc.net/ranklist/school`;

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get<string>(bojUrl, {
          headers: {
            'User-Agent': this.configService.get<string>('BOJ_USER_AGENT'),
          },
        })
        .then((res) => res.data),
    );

    const ssuInfo: { bojRank: number; bojUserCount: number; bojSolvedCount: number; bojSubmitCount: number } = {
      bojRank: 0,
      bojUserCount: 0,
      bojSolvedCount: 0,
      bojSubmitCount: 0,
    };

    const schools = response('#ranklist > tbody > tr');
    const ssu = Array.from(schools).find((school) => {
      return response(school).find('td:nth-child(2) > a').text() === '숭실대학교';
    });
    if (!ssu) {
      return ssuInfo;
    }

    ssuInfo.bojRank = +response(ssu).find('td:nth-child(1)').text();
    ssuInfo.bojUserCount = +response(ssu).find('td:nth-child(3)').text();
    ssuInfo.bojSolvedCount = +response(ssu).find('td:nth-child(4)').text();
    ssuInfo.bojSubmitCount = +response(ssu).find('td:nth-child(5)').text();

    return ssuInfo;
  }

  async getSSURanking(page: number) {
    const url = `https://www.acmicpc.net/school/ranklist/323/` + Math.ceil(page / 2);

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get<string>(url, {
          headers: {
            'User-Agent': this.configService.get<string>('BOJ_USER_AGENT'),
          },
        })
        .then((res) => res.data),
    );

    const users = response('#ranklist > tbody > tr');
    const ranking: { rank: number; bio: string; handle: string; solved: number; submit: number }[] = [];

    for (let rank = 0; rank < 50; rank++) {
      const user = users[page % 2 ? rank : rank + 50];
      if (!user) {
        break;
      }
      const handle = response(user).find('td:nth-child(2) > a').text();
      const bio = response(user).find('td:nth-child(3)').text();
      const solved = +response(user).find('td:nth-child(4)').text();
      const submit = +response(user).find('td:nth-child(5)').text();
      ranking.push({ rank: (page - 1) * 50 + rank + 1, bio, handle, solved, submit });
    }

    return ranking;
  }

  async getBaechu() {
    const url = 'https://raw.githubusercontent.com/kiwiyou/baechu/main/db.json';

    const data: Record<string, Record<string, string>> = {};
    await this.httpService.axiosRef.get<Record<string, { badge: string; background: string }>>(url).then((res) => {
      for (const contestId in res.data) {
        const contest: Record<string, string> = res.data[contestId];
        data[contestId] = {
          badge: contest.badge,
          background: contest.background,
        };
      }
    });

    return data;
  }

  private async otherResponse() {
    const otherUrl = 'https://www.acmicpc.net/contest/other/list';

    return cheerio.load(
      await this.httpService.axiosRef
        .get<string>(otherUrl, {
          headers: {
            'User-Agent': this.configService.get<string>('BOJ_USER_AGENT'),
            Cookie: 'bojautologin=' + process.env.BOJ_AUTO_LOGIN + ';',
          },
        })
        .then((res) => res.data),
    );
  }

  private contestsFromOther(response: any, rowIndex: number): Contest[] {
    const contests: Contest[] = [];

    const rows = response(
      `body > div.wrapper > div.container.content > div.row > div:nth-child(${rowIndex}) > div > table > tbody > tr`,
    ) as Cheerio<AnyNode>;

    for (let i = 0; i < rows.length; i++) {
      const venue = rows.eq(i).find('td:nth-child(1)').text().trim();
      const name = rows.eq(i).find('td:nth-child(2)').text().trim();
      const url = rows.eq(i).find('td:nth-child(2) > a').attr('href') ?? ''; // `null` 방지
      const startTime = new Date(
        1000 * Number(rows.eq(i).find('td:nth-child(3) > span').attr('data-timestamp') ?? 0),
      ).toISOString();
      const endTime = new Date(
        1000 * Number(rows.eq(i).find('td:nth-child(4) > span').attr('data-timestamp') ?? 0),
      ).toISOString();

      contests.push(new Contest(venue, name, url, startTime, endTime));
    }

    return contests;
  }
}
