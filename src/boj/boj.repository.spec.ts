import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';

import { BojRepository } from './boj.repository';

describe('BojRepository', () => {
  let repository: BojRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BojRepository],
    }).compile();

    repository = module.get<BojRepository>(BojRepository);
  });

  describe('getUserProblems', () => {
    it('should return problems', async () => {
      const problems = await repository.getUserProblems('w8385');
      expect(problems).toBeDefined();
    });
  });

  describe('getEndedContests', () => {
    it('should return contests', async () => {
      const contests = await repository.getEndedContests();
      expect(contests).toBeDefined();
    });
  });

  describe('getOngoingContests', () => {
    it('should return contests', async () => {
      const contests = await repository.getOngoingContests();
      expect(contests).toBeDefined();
    });
  });

  describe('getUpcomingContests', () => {
    it('should return contests', async () => {
      const contests = await repository.getUpcomingContests();
      expect(contests).toBeDefined();
    });
  });

  describe('getSSUInfo', () => {
    it('should return SSU info', async () => {
      const ssuInfo = await repository.getSSUInfo();
      expect(ssuInfo).toBeDefined();
    });
  });

  describe('getSSURanking', () => {
    it('should return SSU ranking', async () => {
      const ssuRanking = await repository.getSSURanking(1);
      expect(ssuRanking).toBeDefined();
    });
  });
});
