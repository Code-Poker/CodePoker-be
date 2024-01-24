import { Test, TestingModule } from '@nestjs/testing';
import { PokerService } from './poker.service';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user/user.service';

describe('PokerService', () => {
  let service: PokerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HttpModule],
      providers: [PokerService, UserService],
    }).compile();

    service = module.get<PokerService>(PokerService);
  });

  describe('getPokers', () => {
    it('should return {poker}', async () => {
      const result = [
        {
          id: 1,
          name: 'test',
          updatedAt: '2021-08-01T00:00:00.000Z',
          participants: [1, 2, 3, 4, 5, 6],
        },
      ];
      jest.spyOn(service, 'getAll').mockImplementation(async () => result);

      expect(await service.getAll()).toBe(result);
    });
  });

  describe('getPoker', () => {
    it('should return poker', async () => {
      const result = {
        id: 1,
        name: 'test',
        updatedAt: '2021-08-01T00:00:00.000Z',
        participants: [1, 2, 3, 4, 5, 6],
      };
      jest.spyOn(service, 'get').mockImplementation(async () => result);

      expect(await service.get('1')).toBe(result);
    });
  });
});
