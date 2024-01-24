import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HttpModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('getBojInfoByHandle', () => {
    it('should return {handle, problems}', async () => {
      const result = {
        handle: 'w8385',
        problems: [1000, 1001, 1002, 1003, 1004, 1005],
      };
      jest
        .spyOn(service, 'getBojInfoByHandle')
        .mockImplementation(async () => result);

      expect(await service.getBojInfoByHandle('w8385')).toBe(result);
    });
  });

  describe('getUser', () => {
    it('should return {handle, problems}', async () => {
      const result = {
        updatedAt: '2021-08-01T00:00:00.000Z',
        problems: [1000, 1001, 1002, 1003, 1004, 1005],
      };
      jest.spyOn(service, 'getUser').mockImplementation(async () => result);

      expect(await service.getUser('w8385')).toBe(result);
    });
  });
});
