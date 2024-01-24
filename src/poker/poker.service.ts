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
    console.log(now);
    const poker = {
      id: uuidv4(),
      name,
      createdAt: now,
      userInfos: {},
    };
    console.log(poker);
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
}
