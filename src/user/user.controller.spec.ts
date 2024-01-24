import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpService } from '@nestjs/axios';
import { RedisClientType } from 'redis';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let httpService: HttpService;
  let redis: RedisClientType;

  beforeEach(async () => {
    userService = new UserService(httpService, redis);
    userController = new UserController(userService);
  });

  describe('getBojInfoByHandle', () => {
    it('should return {handle, problems}', async () => {
      const result = {
        handle: 'w8385',
        problems: [1000, 1001, 1002, 1003, 1004, 1005],
      };
      jest
        .spyOn(userService, 'getBojInfoByHandle')
        .mockImplementation(async () => result);

      expect(await userController.getBojUserFromBoj('w8385')).toBe(result);
    });
  });
});
