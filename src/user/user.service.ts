import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  public async getProblemsFromBoj(handle: string) {
    const response = cheerio.load(
      await this.httpService.axiosRef
        .get(`https://www.acmicpc.net/user/${handle}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err?.message + ': ' + JSON.stringify(err?.response?.data));
        }),
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
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err?.message + ': ' + JSON.stringify(err?.response?.data));
        })
        .then((res) => res['profileImageUrl'])) ?? 'https://static.solved.ac/misc/default_profile.png'
    );
  }

  levelToPoint(level: number) {
    return level;
  }
}
