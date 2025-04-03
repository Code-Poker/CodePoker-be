import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as Process from 'node:process';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  public async getProblemsFromBoj(handle: string) {
    const response = cheerio.load(
      await this.httpService.axiosRef
        .get<string>(`https://www.acmicpc.net/user/${handle}`, {
          headers: {
            'User-Agent': Process.env.BOJ_USER_AGENT,
          },
        })
        .then((res) => res.data),
    );

    return response('.col-md-9 > div:nth-child(2) > div:nth-child(2)')
      .text()
      .trim()
      .split(' ')
      .map((problem) => parseInt(problem));
  }

  async getProfileImageFromSolved(handle: string) {
    const url = `https://solved.ac/api/v3/user/show?handle=${handle}`;

    return (
      (await this.httpService.axiosRef
        .get<object>(url)
        .then((res) => res.data)
        .then((res: { profileImageUrl: string }) => res['profileImageUrl'])) ??
      'https://static.solved.ac/misc/default_profile.png'
    );
  }

  levelToPoint(level: number) {
    return level;
  }
}
