import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { BojRepository } from './repository';

describe('BojRepository', () => {
  let repository: BojRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule, await ConfigModule.forRoot()],
      providers: [BojRepository],
    }).compile();

    repository = module.get<BojRepository>(BojRepository);
  });

  describe('Get BOJ contests', () => {
    it('should return ContestList', async () => {
      const contests = await repository.getContestsFromBoj();
      expect(contests).toHaveProperty('ended');
      expect(contests.ended).toBeInstanceOf(Array);
      expect(contests).toHaveProperty('upcoming');
      expect(contests.upcoming).toBeInstanceOf(Array);
      expect(contests).toHaveProperty('ongoing');
      expect(contests.ongoing).toBeInstanceOf(Array);
    }, 10000);
  });

  describe('Get CList contests', () => {
    it('should return ContestList', async () => {
      const contests = await repository.getContestsFromCList();
      expect(contests).toHaveProperty('ended');
      expect(contests.ended).toBeInstanceOf(Array);
      expect(contests).toHaveProperty('upcoming');
      expect(contests.upcoming).toBeInstanceOf(Array);
      expect(contests).toHaveProperty('ongoing');
      expect(contests.ongoing).toBeInstanceOf(Array);
    }, 10000);
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
    }, 10000);
  });
});
