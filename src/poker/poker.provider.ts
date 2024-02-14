import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RedisClientType } from 'redis';

@Injectable()
export class PokerProvider {
  constructor(
    private readonly userService: UserService,
    @Inject('REDIS') private readonly redisClient: RedisClientType,
  ) {}
}
