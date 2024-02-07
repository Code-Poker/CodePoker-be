import { Injectable } from '@nestjs/common';
import { PokerService } from './poker/poker.service';

@Injectable()
export class AppService {
  constructor(private readonly pokerService: PokerService) {}

  async getRecentPokerResult() {
    let recentPoker: {
      pokerId: string;
      name: string;
      createdAt: Date;
      result: { [x: string]: any };
    };

    try {
      recentPoker = await this.pokerService.getRecent();
    } catch (error) {
      return error;
    }

    const sortedHandles = Object.keys(recentPoker.result).sort((a, b) => {
      return recentPoker.result[b].point - recentPoker.result[a].point;
    });

    let resultHtml = `
    <style>
    td, th {
      text-align: left;
      vertical-align: top;
      border: 1px solid black;
      padding: 8px;
      margin: 8px;
      max-width: 300px;
    }
    </style>

    <h1>${recentPoker.name} 결과</h1>
    <h3>${recentPoker.createdAt}</h3>`;
    resultHtml += `<table>`;
    let col = 0;
    for (const handle of sortedHandles) {
      if (col === 0) {
        resultHtml += `<tr>`;
      }
      resultHtml += `<td>`;
      const user = recentPoker.result[handle];
      if (user.goal <= user.point) {
        resultHtml += `<img src="https://static.solved.ac/logo.svg" alt="solved.ac" width="50px" style="float: right">`;
      }
      resultHtml += `<img src="${user.profileImage}" alt="프로필 사진" width="100px" style="border-radius: 50%; border-color: black"> <h2>${handle}</h2>`;
      resultHtml += `<h3>목표: ${user.goal}, 점수: ${user.point}</h3>`;
      resultHtml += `<details><summary>${user.problems.length} 문제</summary>`;
      resultHtml += '<ul>';
      for (const problem of user.problems) {
        resultHtml += `<li><a href="https://www.acmicpc.net/problem/${problem.id}">${problem.title}</a> (${problem.level})</li>`;
      }
      resultHtml += '</ul></details>';
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
