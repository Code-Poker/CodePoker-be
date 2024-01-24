import { Inject, Injectable } from '@nestjs/common';
import { CreatePokerDto } from './dto/create-user.dto';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisClientType } from 'redis';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PokerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    @Inject('REDIS') private readonly redisClient: RedisClientType,
  ) {}

  async create(name: string, createPokerDto: CreatePokerDto) {
    const now = new Date().toString();
    const poker = {
      id: uuidv4(),
      name,
      createdAt: now,
      userInfos: {},
    };
    for (const userInfo in createPokerDto.userInfos) {
      const point = createPokerDto.userInfos[userInfo];
      poker.userInfos[userInfo] = {
        point,
        problems: await this.userService.getProblemsByHandle(userInfo),
      };
    }

    await this.redisClient.json.set(poker.id, '.', poker);
  }

  async getAll() {
    const keys = await this.redisClient.keys('*');

    const pokers = [];
    for (const key of keys) {
      const poker = await this.redisClient.json.get(key);
      const createdAt = poker['createdAt'];
      const participants = [];
      for (const userInfo in poker['userInfos']) {
        participants.push(userInfo);
      }

      pokers.push({
        id: key,
        createdAt,
        participants,
      });
    }

    return pokers;
  }

  async get(id: string) {
    return await this.redisClient.json.get(id);
  }

  async calc(id: string) {
    const poker = await this.redisClient.json.get(id);
    const result = {
      id,
      name: poker['name'],
      createdAt: poker['createdAt'],
      result: {},
    };

    for (const userInfo in poker['userInfos']) {
      const point = poker['userInfos'][userInfo]['point'];
      const acientProblems = poker['userInfos'][userInfo]['problems'];
      const recentProblems =
        await this.userService.getProblemsByHandle(userInfo);

      const solved = [];
      for (const problem of recentProblems) {
        if (!acientProblems.includes(problem)) {
          solved.push(problem);
        }
      }

      console.log(solved);
      const solvedPoint = await this.calcPointFromSolved(solved);
      result['result'][userInfo] = `${solvedPoint} / ${point}`;
    }

    return result;
  }

  private async calcPointFromSolved(problems: number[]) {
    let point = 0;
    for (let page = 1; page <= (problems.length + 49) / 50; page++) {
      let url = `https://solved.ac/api/v3/search/problem?page=${page}&query=`;
      for (let i = (page - 1) * 50; i < page * 50; i++) {
        if (i >= problems.length) {
          break;
        }
        url = url.concat('id:' + problems[i] + '|');
      }
      console.log(url);

      const response = await this.httpService.axiosRef
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(
            err?.message + ': ' + JSON.stringify(err?.response?.data),
          );
        });

      for (const problem of response['items']) {
        point += Number(problem['level']);
      }
    }
    return point;
  }
}
