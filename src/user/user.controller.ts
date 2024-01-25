import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'BOJ 유저 정보 가져오기' })
  @Get('info/:handle')
  getBojUserFromBoj(@Param('handle') handle: string) {
    return this.userService.getBojInfoByHandle(handle);
  }

  @ApiExcludeEndpoint()
  @Post('set/:handle')
  setBojUserToRedis(@Param('handle') handle: string) {
    return this.userService.setUser(handle);
  }

  @ApiExcludeEndpoint()
  @Get('get/:handle')
  getBojUserFromRedis(@Param('handle') handle: string) {
    return this.userService.getUser(handle);
  }

  @ApiOperation({ summary: '포커 결과 자기꺼만 계산하기' })
  @Get(':pokerId/calc/:handle')
  calcScore(
    @Param('pokerId') pokerId: string,
    @Param('handle') handle: string,
  ) {
    return this.userService.calcScore(pokerId, handle);
  }
}
