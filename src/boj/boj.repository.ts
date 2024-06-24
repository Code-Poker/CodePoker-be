import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as process from 'node:process';

import { Contest } from './entities/contest.entity';

@Injectable()
export class BojRepository {
  constructor(private readonly httpService: HttpService) {}

  async getUserProblems(handle: string) {
    const url = `https://www.acmicpc.net/user/${handle}`;

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
          },
        })
        .then((res) => res.data),
    );

    const problems = {
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
      if (!panelType) {
        continue;
      }

      const rows = panels.eq(i).find('.problem-list > a');
      for (let j = 0; j < rows.length; j++) {
        const problemId = +rows.eq(j).text();
        problems[panelType].push(problemId);
      }
    }

    return problems;
  }

  async getEndedContests(): Promise<Contest[]> {
    const endedUrl = 'https://www.acmicpc.net/contest/official/list';

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(endedUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
          },
        })
        .then((res) => res.data),
    );

    const contests = [];

    const rows = response(
      'body > div.wrapper > div.container.content > div.row > div:nth-child(2) > div > table > tbody > tr',
    );
    for (let i = 0; i < rows.length; i++) {
      const venue = 'BOJ Open';
      const name = rows.eq(i).find('td:nth-child(1) > a').text();
      const url = 'https://www.acmicpc.net' + rows.eq(i).find('td:nth-child(1) > a').attr('href');
      const startDate = new Date(
        1000 * +rows.eq(i).find('td:nth-child(4) > span').attr('data-timestamp'),
      ).toISOString();
      const endDate = new Date(1000 * +rows.eq(i).find('td:nth-child(5) > span').attr('data-timestamp')).toISOString();
      contests.push({ venue, name, url, startDate, endDate });
    }

    return contests;
  }

  async getOngoingContests(): Promise<Contest[]> {
    const otherUrl = 'https://www.acmicpc.net/contest/other/list';

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(otherUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
            Cookie: 'bojautologin=' + process.env.BOJ_AUTO_LOGIN + ';',
          },
        })
        .then((res) => res.data),
    );

    const contests = [];

    const rowIndex = response('.col-md-12').length === 6 ? 5 : 4;
    const rows = response(
      `body > div.wrapper > div.container.content > div.row > div:nth-child(${rowIndex}) > div > table > tbody > tr`,
    );
    for (let i = 0; i < rows.length; i++) {
      const venue = rows.eq(i).find('td:nth-child(1)').text();
      const name = rows.eq(i).find('td:nth-child(2)').text();
      const url = rows.eq(i).find('td:nth-child(2) > a').attr('href');
      const startDate = new Date(
        1000 * +rows.eq(i).find('td:nth-child(3) > span').attr('data-timestamp'),
      ).toISOString();
      const endDate = new Date(1000 * +rows.eq(i).find('td:nth-child(4) > span').attr('data-timestamp')).toISOString();
      contests.push({ venue, name, url, startDate, endDate });
    }

    return contests;
  }

  async getUpcomingContests(): Promise<Contest[]> {
    const otherUrl = 'https://www.acmicpc.net/contest/other/list';

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(otherUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
            Cookie: 'bojautologin=' + process.env.BOJ_AUTO_LOGIN + ';',
          },
        })
        .then((res) => res.data),
    );

    const contests = [];

    const rowIndex = response('.col-md-12').length === 6 ? 5 : 4;
    const rows = response(
      `body > div.wrapper > div.container.content > div.row > div:nth-child(${rowIndex}) > div > table > tbody > tr`,
    );
    for (let i = 0; i < rows.length; i++) {
      const venue = rows.eq(i).find('td:nth-child(1)').text();
      const name = rows.eq(i).find('td:nth-child(2)').text();
      const url = rows.eq(i).find('td:nth-child(2) > a').attr('href');
      const startDate = new Date(
        1000 * +rows.eq(i).find('td:nth-child(3) > span').attr('data-timestamp'),
      ).toISOString();
      const endDate = new Date(1000 * +rows.eq(i).find('td:nth-child(4) > span').attr('data-timestamp')).toISOString();
      contests.push({ venue, name, url, startDate, endDate });
    }

    return contests;
  }

  async getSSUInfo() {
    const bojUrl = `https://www.acmicpc.net/ranklist/school`;

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(bojUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
          },
        })
        .then((res) => res.data),
    );

    const schools = response('#ranklist > tbody > tr');
    const ssu = Array.from(schools).find((school) => {
      return school['children'][1]['children'][0]['data'] === '숭실대학교';
    });

    if (!ssu) {
      return null;
    }

    const bojRank = +ssu['children'][0]['data'];
    const bojUserCount = +ssu['children'][2]['children'][0]['data'];
    const bojSubmitCount = +ssu['children'][4]['children'][0]['data'];

    return { bojRank, bojUserCount, bojSubmitCount };
  }

  async getSSURanking(page: number) {
    const url = `https://www.acmicpc.net/school/ranklist/323/` + Math.ceil(page / 2);

    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
          },
        })
        .then((res) => res.data),
    );

    const users = response('#ranklist > tbody > tr');
    const ranking = [];

    for (let rank = 0; rank < 50; rank++) {
      const user = users[page % 2 ? rank : rank + 50];
      if (!user) {
        break;
      }
      const handle = user['children'][1]['children'][0]['data'];
      const bio = user['children'][2]['children'][0]['data'];
      const solvedCount = +user['children'][3]['children'][0]['data'];
      const submitCount = +user['children'][4]['children'][0]['data'];
      ranking.push({ rank: rank + 1, handle, bio, solvedCount, submitCount });
    }

    return ranking;
  }
}
