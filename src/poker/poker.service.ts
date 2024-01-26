import { Inject, Injectable } from '@nestjs/common';
import { CreatePokerDto } from './dto/create-user.dto';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisClientType } from 'redis';

@Injectable()
export class PokerService {
  constructor(
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
    await this.setRecent(poker.id);
  }

  async getAll() {
    let keys = await this.redisClient.keys('*');
    keys = keys.filter((key) => key !== 'recent');

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

      const solvedPoint = await this.userService.calcPointFromSolved(solved);
      result['result'][userInfo] = `${solvedPoint} / ${point}`;
    }

    return result;
  }

  async setRecent(pokerId: string) {
    await this.redisClient.set('recent', pokerId);
    return { recent: pokerId };
  }
}
