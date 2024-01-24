import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'BOJ 유저 정보 가져오기' })
  @Get('info/:handle')
  getBojUserFromBoj(@Param('handle') handle: string) {
    return this.userService.getBojInfoByHandle(handle);
  }

  @Post('set/:handle')
  setBojUserToRedis(@Param('handle') handle: string) {
    return this.userService.setUser(handle);
  }

  @Get('get/:handle')
  getBojUserFromRedis(@Param('handle') handle: string) {
    return this.userService.getUser(handle);
  }
}
