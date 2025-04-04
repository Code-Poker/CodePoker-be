import { Poker } from '@entities/poker.entity';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { GroupRepository } from '../group/repository';
import { ProblemService } from '../problem/service';
import { UserService } from '../user/service';
import { CreatePokerDto } from './dto/create-poker.dto';
import { PokerRepository } from './repository';

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
      id: new ObjectId().toString(),
      name,
      participants: [],
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
        result: [],
      });
    }

    const createdPoker = await this.pokerRepository.create(poker);
    const pokerId = createdPoker.id;
    group.pokers.push(pokerId);
    await this.groupRepository.update(createPokerDto.groupId, group);

    return poker;
  }

  async getAll(): Promise<Poker[]> {
    const pokers = await this.pokerRepository.getAll();
    // for (const poker of pokers) {
    //   poker.participants.forEach((participant) => {
    //     const { handle, profileImage, goal, point } = participant;
    //     participant = {
    //       handle,
    //       profileImage,
    //       goal,
    //       point,
    //       snapshot: [],
    //       result: [],
    //     };
    //   });
    // }

    return pokers;
  }

  async get(id: string) {
    const poker = await this.pokerRepository.get(id);
    for (const participant of poker.participants) {
      participant.snapshot = [];
    }
    return poker;
  }

  async refreshRecent() {
    const pokers = await this.pokerRepository.getAll();
    for (const poker of pokers) {
      if (poker.endTime < new Date()) {
        continue;
      }
      await this.refresh(poker.id);
    }
  }

  async refresh(pokerId: string) {
    const poker = await this.pokerRepository.get(pokerId);
    this.pokerRepository.validate(pokerId, poker);

    for (const participant of poker.participants) {
      const snapshot = participant.snapshot;
      const present = await this.userService.getProblemsFromBoj(participant.handle);

      const solved: number[] = [];
      for (const problem of present) {
        if (!snapshot.includes(problem)) {
          solved.push(problem);
        }
      }

      const solvedProblems = await this.problemService.getProblemsFromSolved(solved);
      participant.point = solvedProblems.reduce(
        (
          acc,
          cur: {
            level: number;
          },
        ) => acc + this.userService.levelToPoint(cur.level),
        0,
      );

      participant.result = solvedProblems.map((problem: { problemId: number; titleKo: string; level: number }) => {
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

  deleteAll() {
    return this.pokerRepository.deleteAll();
  }
}
