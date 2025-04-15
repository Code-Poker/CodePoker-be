import { Contest, ContestList } from '@entities/contest.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as process from 'node:process';
import * as Process from 'node:process';

@Injectable()
export class BojRepository {
  constructor(private readonly httpService: HttpService) {}

  async getUserProblems(handle: string) {
    const url = `https://www.acmicpc.net/user/${handle}`;

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get<string>(url, {
          headers: {
            'User-Agent': Process.env.BOJ_USER_AGENT,
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

  async getContestsFromBoj(): Promise<ContestList> {
    const url = 'https://www.acmicpc.net/contest/official/list';

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get<string>(url, {
          headers: {
            'User-Agent': Process.env.BOJ_USER_AGENT,
          },
        })
        .then((res) => res.data),
    );

    const contests: ContestList = new ContestList();

    const rows = response(
      'body > div.wrapper > div.container.content > div.row > div:nth-child(2) > div > table > tbody > tr',
    );
    for (let i = 0; i < rows.length; i++) {
      const venue = 'BOJ Open';
      const name = rows.eq(i).find('td:nth-child(1) > a').text();
      const url = 'https://www.acmicpc.net' + rows.eq(i).find('td:nth-child(1) > a').attr('href');
      const startDate = new Date(
        1000 * parseInt(<string>rows.eq(i).find('td:nth-child(4) > span').attr('data-timestamp')),
      );
      const endDate = new Date(
        1000 * parseInt(<string>rows.eq(i).find('td:nth-child(5) > span').attr('data-timestamp')),
      );

      const contest = new Contest(venue, name, url, startDate, endDate);
      if (endDate < new Date()) {
        contests.ended.push(contest);
      } else if (new Date() < startDate) {
        contests.upcoming.push(contest);
      } else {
        contests.ongoing.push(contest);
      }
    }

    return contests;
  }

  async getContestsFromCList(): Promise<ContestList> {
    const url = 'https://clist.by/api/v4/contest/';
    const headers = {
      Authorization: `${process.env.CLIST_API_KEY}`,
    };
    const params = {
      resource_id__in: '1, 25, 86, 141, 93, 102',
      order_by: '-start',
    };

    const response = await this.httpService.axiosRef.get<{
      objects: {
        event: string;
        start: string;
        end: string;
        href: string;
        resource_id: number;
      }[];
    }>(url, {
      headers: headers,
      params: params,
    });

    const clist: {
      event: string;
      start: string;
      end: string;
      href: string;
      resource_id: number;
    }[] = response.data.objects;

    const contests: ContestList = new ContestList();
    for (const contest of clist) {
      const startDate = new Date(contest.start);
      const endDate = new Date(contest.end);

      if (endDate < new Date()) {
        contests.ended.push(Contest.fromCList(contest));
      } else if (new Date() < startDate) {
        contests.upcoming.push(Contest.fromCList(contest));
      } else {
        contests.ongoing.push(Contest.fromCList(contest));
      }
    }

    return contests;
  }

  async getSSUInfo() {
    const bojUrl = `https://www.acmicpc.net/ranklist/school`;

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get<string>(bojUrl, {
          headers: {
            'User-Agent': Process.env.BOJ_USER_AGENT,
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
            'User-Agent': Process.env.BOJ_USER_AGENT,
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

  async getBaechu(): Promise<Record<string, { badge: string; background: string }>> {
    const url = 'https://raw.githubusercontent.com/kiwiyou/baechu/main/db.json';

    const data: Record<string, { badge: string; background: string }> = {};
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
}
