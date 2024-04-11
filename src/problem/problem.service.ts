import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProblemService {
  constructor(private readonly httpService: HttpService) {}

  // async refresh(problemId: string) {
  //   const problem = await this.getProblemFromSolved(problemId);
  //
  //   const wellKnownProblems = await this.redis.json.get('wellKnownProblems');
  //   wellKnownProblems[problemId] = problem;
  //
  //   await this.redis.json.set('wellKnownProblems', '.', wellKnownProblems);
  // }

  async getProblemFromSolved(problemId: string) {
    const url = `https://solved.ac/api/v3/problem/show?problemId=${problemId}`;
    return await this.httpService.axiosRef.get(url).then((res) => res.data);
  }

  async getProblemsFromSolved(problemIds: number[]) {
    const problems = [];

    for (let page = 1; page <= (problemIds.length + 49) / 50; page++) {
      let url = `https://solved.ac/api/v3/search/problem?query=`;
      for (
        let i = (page - 1) * 50;
        i < page * 50 && i < problemIds.length;
        i++
      ) {
        url = url.concat('id:' + problemIds[i] + '|');
      }

      const response = await this.httpService.axiosRef
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(
            err?.message + ': ' + JSON.stringify(err?.response?.data),
          );
        });

      for (const problem of response['items']) {
        problems.push(problem);
      }
    }

    problems.sort((a, b) => a['problemId'] - b['problemId']);
    return problems;
  }
}
