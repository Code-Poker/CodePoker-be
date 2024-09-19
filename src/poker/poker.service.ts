import { Injectable } from '@nestjs/common';

import { GroupRepository } from '../group/group.repository';
import { ProblemService } from '../problem/problem.service';
import { UserService } from '../user/user.service';
import { CreatePokerDto } from './dto/create-poker.dto';
import { Poker } from './entities/poker.entity';
import { PokerRepository } from './poker.repository';

@Injectable()
export class PokerService {
  constructor(
    private readonly userService: UserService,
    private readonly problemService: ProblemService,
    private readonly pokerRepository: PokerRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async create(name: string, createPokerDto: CreatePokerDto): Promise<Poker> {
    const group = await this.groupRepository.get(createPokerDto.groupId);
    this.groupRepository.validate(createPokerDto.groupId, group);

    const poker: Poker = {
      id: undefined,
      name,
      participants: [],
      tasks: createPokerDto.tasks,
      startTime: new Date(),
      endTime: createPokerDto.endDate,
    };

    const res: Poker = {
      id: undefined,
      name,
      participants: [],
      tasks: createPokerDto.tasks,
      startTime: new Date(),
      endTime: createPokerDto.endDate,
    };

    for (const participant of createPokerDto.participants) {
      const handle = participant.handle;
      const goal = participant.goal;
      const profileImage = await this.userService.getProfileImageFromSolved(handle);

      const snapshot = await this.userService.getProblemsFromBoj(handle);
      poker.participants.push({
        handle,
        profileImage,
        snapshot,
        point: 0,

        goal,
        tasksDone: null,
        result: null,
      });

      res.participants.push({
        handle,
        profileImage,
        snapshot: [],
        point: 0,

        goal,
        tasksDone: null,
        result: null,
      });
    }

    const createdPoker = await this.pokerRepository.create(poker);
    const pokerId = createdPoker.id;
    group.pokers.push(pokerId);
    await this.groupRepository.update(createPokerDto.groupId, group);

    res.id = pokerId;
    return res;
  }

  async getAll(): Promise<Poker[]> {
    const pokers = (await this.pokerRepository.getAll()) as Poker[];
    for (const poker of pokers) {
      for (const participant in poker.participants) {
        const { handle, profileImage, goal, point, tasksDone } = poker.participants[participant];
        poker.participants[participant] = {
          handle,
          profileImage,
          goal,
          point,
          tasksDone,
          snapshot: [],
          result: [],
        };
      }
    }
    return pokers;
  }

  async get(id: string) {
    const createdPoker = (await this.pokerRepository.get(id)) as any;
    for (const participant of createdPoker.participants) {
      participant.snapshot = [];
    }
    return createdPoker;
  }

  async refreshRecent() {
    const pokers = (await this.pokerRepository.getAll()) as Poker[];
    for (const poker of pokers) {
      if (poker.endTime < new Date()) {
        continue;
      }
      await this.refresh(poker.id);
    }
  }

  async refresh(pokerId: string) {
    const poker = (await this.pokerRepository.get(pokerId)) as Poker;
    this.pokerRepository.validate(pokerId, poker);

    for (const participant of poker.participants) {
      const snapshot = participant.snapshot;
      const present = await this.userService.getProblemsFromBoj(participant.handle);

      const solved = [];
      for (const problem of present) {
        if (!snapshot.includes(problem)) {
          solved.push(problem);
        }
      }

      const solvedProblems = await this.problemService.getProblemsFromSolved(solved);
      participant.point = solvedProblems.reduce((acc, cur) => acc + this.userService.levelToPoint(cur.level), 0);

      participant.result = solvedProblems.map((problem) => {
        return {
          problemId: problem.problemId,
          titleKo: problem.titleKo,
          level: this.userService.levelToPoint(problem.level),
        };
      });
    }

    poker.participants.sort((a, b) => {
      return b.point - a.point;
    });
    this.pokerRepository.update(pokerId, poker);
  }

  async deleteAll() {
    return this.pokerRepository.deleteAll();
  }
}
