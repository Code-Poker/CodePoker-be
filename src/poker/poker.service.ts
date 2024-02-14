import { Inject, Injectable } from '@nestjs/common';
import { CreatePokerDto } from './dto/create-poker.dto';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisClientType } from 'redis';
import { UpdatePokerDto } from './dto/update-poker.dto';
import { AppendParticipantDto } from './dto/append-participant.dto';

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
      participants: {},
    };

    for (const handle in createPokerDto.participants) {
      const goal = createPokerDto.participants[handle];
      const profileImage =
        await this.userService.getProfileImageFromSolved(handle);
      const problems = await this.userService.getProblemsFromBoj(handle);

      poker.participants[handle] = {
        profileImage,
        goal,
        problems,
      };
    }

    await this.redisClient.json.set(poker.id, '.', poker);
    await this.setRecent(poker.id);
  }

  async getAll() {
    let keys = await this.redisClient.keys('*');
    keys = keys.filter((key) => key !== 'recent');
    keys = keys.filter((key) => !key.startsWith('result_'));

    const pokers = [];
    for (const key of keys) {
      const poker = await this.redisClient.json.get(key);
      const createdAt = poker['createdAt'];
      const participants = [];
      for (const handle in poker['participants']) {
        participants.push(handle);
      }

      pokers.push({
        id: key,
        name: poker['name'],
        createdAt,
        participants,
      });
    }
    pokers.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    return pokers;
  }

  async get(id: string) {
    return await this.redisClient.json.get(id);
  }

  async appendParticipant(
    pokerId: string,
    addParticipantDto: AppendParticipantDto,
  ) {
    const poker = await this.redisClient.json.get(pokerId);
    const handle = addParticipantDto.handle;
    const profileImage =
      await this.userService.getProfileImageFromSolved(handle);
    const goal = addParticipantDto.goal;
    const problems = (await this.userService.getProblemsFromBoj(handle)).filter(
      (problem) => !addParticipantDto.excludeProblems.includes(problem),
    );

    poker['participants'][handle] = {
      profileImage,
      goal,
      problems: problems,
    };

    return await this.redisClient.json.set(pokerId, '.', poker);
  }

  async updateGoal(pokerId: string, updatePokerDto: UpdatePokerDto) {
    const poker = await this.redisClient.json.get(pokerId);
    for (const handle in updatePokerDto.participants) {
      poker['participants'][handle].goal = updatePokerDto.participants[handle];
    }

    return await this.redisClient.json.set(pokerId, '.', poker);
  }

  async calc(pokerId: string) {
    const lastResult = await this.redisClient.json.get('result_' + pokerId);
    if (lastResult !== null) {
      return lastResult;
    }

    const poker = await this.redisClient.json.get(pokerId);
    const result = {
      pokerId,
      name: poker['name'],
      createdAt: poker['createdAt'],
      result: {},
    };

    for (const handle in poker['participants']) {
      result['result'][handle] = await this.userService.calcScore(
        pokerId,
        handle,
      );
    }

    await this.redisClient.json.set('result_' + pokerId, '.', result);
    await this.redisClient.EXPIRE('result_' + pokerId, 60 * 10);

    return result;
  }

  async getRecent() {
    let recentPokerId: string;
    try {
      recentPokerId = await this.redisClient.get('recent');
      return await this.calc(recentPokerId);
    } catch (error) {
      return error;
    }
  }

  private async setRecent(pokerId: string) {
    await this.redisClient.set('recent', pokerId);
    return { recent: pokerId };
  }
}
