import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { BojRepository } from './boj.repository';
import { Contest } from './entities/contest.entity';

describe('BojRepository', () => {
  let repository: BojRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [BojRepository],
    }).compile();

    repository = module.get<BojRepository>(BojRepository);

    jest.setTimeout(10000);
  });

  describe('getUserProblems', () => {
    it('should return problems', async () => {
      const problems = await repository.getUserProblems('w8385');
      expect(problems).toHaveProperty('solved');
      expect(problems.solved).toBeInstanceOf(Array);
      expect(problems).toHaveProperty('tried');
      expect(problems.tried).toBeInstanceOf(Array);
      expect(problems).toHaveProperty('extra');
      expect(problems.extra).toBeInstanceOf(Array);
    });
  });

  describe('getEndedContests', () => {
    it('should return contests', async () => {
      const contests = await repository.getEndedContests();
      expect(contests).toBeInstanceOf(Array<Contest>);
      contests.forEach((contest) => {
        expect(contest).toBeInstanceOf(Contest);
      });
    });
  });

  describe('getOngoingContests', () => {
    it('should return contests', async () => {
      const contests = await repository.getOngoingContests();
      expect(contests).toBeInstanceOf(Array<Contest>);
      contests.forEach((contest) => {
        expect(contest).toBeInstanceOf(Contest);
      });
    });
  });

  describe('getUpcomingContests', () => {
    it('should return contests', async () => {
      const contests = await repository.getUpcomingContests();
      expect(contests).toBeInstanceOf(Array<Contest>);
      contests.forEach((contest) => {
        expect(contest).toBeInstanceOf(Contest);
      });
    });
  });

  describe('getSSUInfo', () => {
    it('should return SSU info', async () => {
      const ssuInfo = await repository.getSSUInfo();
      expect(ssuInfo).toHaveProperty('bojUserCount');
      expect(ssuInfo).toHaveProperty('bojRank');
      expect(ssuInfo).toHaveProperty('bojSolvedCount');
      expect(ssuInfo).toHaveProperty('bojSubmitCount');
    });
  });

  describe('getSSURanking', () => {
    it('should return SSU ranking', async () => {
      const ssuRanking = await repository.getSSURanking(1);
      ssuRanking.forEach((user) => {
        expect(user).toHaveProperty('handle');
        expect(user).toHaveProperty('bio');
        expect(user).toHaveProperty('solved');
      });
    });
  });
});
