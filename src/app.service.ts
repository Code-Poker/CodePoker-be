import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { PokerService } from './poker/poker.service';

@Injectable()
export class AppService {
  constructor(
    private readonly pokerService: PokerService,
    @Inject('REDIS') private readonly redisClient: RedisClientType,
  ) {}

  async getRecentPokerResult() {
    let recentPokerId: string;
    try {
      recentPokerId = await this.redisClient.get('recent');
    } catch (_) {
      return '최근 포커 결과가 없습니다.';
    }

    const result = await this.pokerService.calc(recentPokerId);
    let resultHtml = `
    <style>
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border-color: black;
    }
    td, th {
      text-align: left;
      vertical-align: top;
      border: 1px solid black;
      padding: 8px;
      margin: 8px;
      max-width: 300px;
    }
    </style>

    <h1>${result.name} 포커 결과</h1>
    <h3>${result.createdAt}</h3>`;
    resultHtml += `<table>`;
    let col = 0;
    for (const handle in result.result) {
      if (col === 0) {
        resultHtml += `<tr>`;
      }
      resultHtml += `<td>`;
      const user = result.result[handle];
      resultHtml += `<h2><img src="${user.profileImage}" alt="프로필 사진"> ${handle}</h2>`;
      resultHtml += `<h3>목표: ${user.goal}, 점수: ${user.point}</h3>`;
      resultHtml += `<h3>문제</h3>`;
      resultHtml += '<ul>';
      for (const problem of user.problems) {
        resultHtml += `<li><a href="https://www.acmicpc.net/problem/${problem.id}">${problem.title}</a> (${problem.level})</li>`;
      }
      resultHtml += '</ul>';
      resultHtml += `</td>`;
      if (col === 4) {
        resultHtml += `</tr>`;
        col = 0;
      } else {
        col++;
      }
    }
    resultHtml += `</table>`;

    return resultHtml;
  }
}
