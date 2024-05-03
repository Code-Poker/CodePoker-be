import { Inject, Injectable } from '@nestjs/common';
import * as process from 'node:process';

import { Contest } from './entities/contest.entity';

@Injectable()
export class BojRepository {
  constructor(
    @Inject('WEBDRIVER')
    private readonly browser: WebdriverIO.Browser,
  ) {}

  async getUserProblems(handle: string) {
    const url = `https://www.acmicpc.net/user/${handle}`;
    await this.browser.url(url);

    return await this.browser.execute(() => {
      const panelTitle = {
        '맞은 문제': 'solved',
        '맞았지만 만점을 받지 못한 문제': 'tried',
        '시도했지만 맞지 못한 문제': 'tried',
        '맞은 번외 문제': 'extra',
      };

      const problems = {
        solved: [],
        tried: [],
        extra: [],
      };

      const panels = document.querySelectorAll('.panel.panel-default');
      for (const panel of panels) {
        const title = panel.querySelector('.panel-title').textContent;
        const panelType = panelTitle[title];
        if (!panelType) {
          continue;
        }
        const rows = panel.querySelectorAll('.problem-list > a');
        for (const row of rows) {
          const problemId = +row.textContent;
          problems[panelType].push(problemId);
        }
      }

      return problems;
    });
  }

  async getEndedContests(): Promise<Contest[]> {
    const endedUrl = 'https://www.acmicpc.net/contest/official/list';
    await this.browser.url(endedUrl);

    return await this.browser.execute(() => {
      const contests: Contest[] = [];
      const rows = document.querySelectorAll(
        'body > div.wrapper > div.container.content > div.row > div:nth-child(2) > div > table > tbody > tr',
      );

      for (const row of rows) {
        const venue = 'BOJ Open';
        const name = row.querySelector('td:nth-child(1) > a').textContent;
        const url =
          'https://www.acmicpc.net' +
          row.querySelector('td:nth-child(1) > a').getAttribute('href');
        const startDate = new Date(
          1000 *
            +row
              .querySelector('td:nth-child(4) > span')
              .getAttribute('data-timestamp'),
        ).toISOString();
        const endDate = new Date(
          1000 *
            +row
              .querySelector('td:nth-child(5) > span')
              .getAttribute('data-timestamp'),
        ).toISOString();
        contests.push({ venue, name, url, startDate, endDate });
      }
      return contests;
    });
  }

  async getOngoingContests(): Promise<Contest[]> {
    const otherUrl = 'https://www.acmicpc.net/contest/other/list';
    await this.browser.url(otherUrl);
    await this.browser.setCookies([
      {
        name: 'bojautologin',
        value: process.env.BOJ_AUTO_LOGIN,
      },
    ]);

    return await this.browser.execute(() => {
      const contests: Contest[] = [];

      if (document.getElementsByClassName('col-md-12').length < 6) {
        return contests;
      }

      const rows = document.querySelectorAll(
        'body > div.wrapper > div.container.content > div.row > div:nth-child(3) > div > table > tbody > tr',
      );

      for (const row of rows) {
        const venue = row.querySelector('td:nth-child(1)').textContent;
        const name = row.querySelector('td:nth-child(2)').textContent;
        let url = null;
        if (row.querySelector('td:nth-child(2) > a')) {
          url = row.querySelector('td:nth-child(2) > a').getAttribute('href');
        }
        const startDate = new Date(
          1000 *
            +row
              .querySelector('td:nth-child(3) > span')
              .getAttribute('data-timestamp'),
        ).toISOString();
        const endDate = new Date(
          1000 *
            +row
              .querySelector('td:nth-child(4) > span')
              .getAttribute('data-timestamp'),
        ).toISOString();
        contests.push({ venue, name, url, startDate, endDate });
      }
      return contests;
    });
  }

  async getUpcomingContests(): Promise<Contest[]> {
    const otherUrl = 'https://www.acmicpc.net/contest/other/list';
    await this.browser.url(otherUrl);
    await this.browser.setCookies([
      {
        name: 'bojautologin',
        value: process.env.BOJ_AUTO_LOGIN,
      },
    ]);

    return await this.browser.execute(() => {
      const contests: Contest[] = [];

      const rowIndex =
        document.getElementsByClassName('col-md-12').length === 6 ? 5 : 4;
      const rows = document.querySelectorAll(
        `body > div.wrapper > div.container.content > div.row > div:nth-child(${rowIndex}) > div > table > tbody > tr`,
      );
      for (const row of rows) {
        const venue = row.querySelector('td:nth-child(1)').textContent;
        const name = row.querySelector('td:nth-child(2)').textContent;
        let url = null;
        if (row.querySelector('td:nth-child(2) > a')) {
          url = row.querySelector('td:nth-child(2) > a').getAttribute('href');
        }
        const startDate = new Date(
          1000 *
            +row
              .querySelector('td:nth-child(3) > span')
              .getAttribute('data-timestamp'),
        ).toISOString();
        const endDate = new Date(
          1000 *
            +row
              .querySelector('td:nth-child(4) > span')
              .getAttribute('data-timestamp'),
        ).toISOString();
        contests.push({ venue, name, url, startDate, endDate });
      }
      return contests;
    });
  }

  async getSSUInfo() {
    const bojUrl = `https://www.acmicpc.net/ranklist/school`;
    await this.browser.url(bojUrl);

    return await this.browser.execute(() => {
      const schools = document.querySelectorAll('#ranklist > tbody > tr');

      const ssu = Array.from(schools).find((school) => {
        return (
          school.querySelector(' td:nth-child(2)').textContent === '숭실대학교'
        );
      });

      if (!ssu) {
        return null;
      }

      const bojRank = +ssu.querySelector(' td:nth-child(1)').textContent;
      const bojUserCount = +ssu.querySelector('td:nth-child(3)').textContent;
      const bojSubmitCount = +ssu.querySelector('td:nth-child(5)').textContent;

      return { bojRank, bojUserCount, bojSubmitCount };
    });
  }

  async getSSURanking(page: number) {
    const url =
      `https://www.acmicpc.net/school/ranklist/323/` + Math.ceil(page / 2);
    await this.browser.url(url);

    return await this.browser.execute((page) => {
      const users = document.querySelectorAll('#ranklist > tbody > tr');
      const ranking = [];
      for (let rank = 0; rank < 50; rank++) {
        const user = users[page % 2 ? rank : rank + 50];
        if (!user) {
          break;
        }
        const handle = user.querySelector('td:nth-child(2) > a').textContent;
        const bio = user.querySelector('td:nth-child(3)').textContent;
        const solvedCount = +user.querySelector('td:nth-child(4)').textContent;
        const submitCount = +user.querySelector('td:nth-child(5)').textContent;
        ranking.push({ rank: rank + 1, handle, bio, solvedCount, submitCount });
      }

      return ranking;
    }, page);
  }
}
