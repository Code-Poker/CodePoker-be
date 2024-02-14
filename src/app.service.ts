import { Injectable } from '@nestjs/common';
import { PokerService } from './poker/poker.service';

@Injectable()
export class AppService {
  constructor(private readonly pokerService: PokerService) {}

  async getRecentPokerResult() {
    const recentPoker = await this.pokerService.getRecent();

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

    <h1>${recentPoker['name']} 결과</h1>
    <h3>${recentPoker['createdAt']}</h3>`;
    resultHtml += `<table>`;
    let col = 0;
    for (const participant of recentPoker['result']) {
      if (col === 0) {
        resultHtml += `<tr>`;
      }
      resultHtml += `<td>`;
      if (participant['goal'] <= participant['point']) {
        resultHtml += `<img src="https://static.solved.ac/logo.svg" alt="solved.ac" width="50px" style="float: right">`;
      }
      resultHtml += `<img src="${participant['profileImage']}" alt="프로필 사진" width="100px" style="border-radius: 50%; border-color: black"> <h2><a href="https://solved.ac/profile/${participant['handle']}">${participant['handle']}</a></h2>`;
      resultHtml += `<h3>목표: ${participant['goal']}, 점수: ${participant['point']}</h3>`;
      resultHtml += `<details><summary>${participant['problems'].length} 문제</summary>`;
      resultHtml += '<ul>';
      for (const problem of participant['problems']) {
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
