import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '포커 결과 자기꺼만 계산하기' })
  @Get(':pokerId/calc/:handle')
  calcScore(
    @Param('pokerId') pokerId: string,
    @Param('handle') handle: string,
  ) {
    return this.userService.calcScore(pokerId, handle);
  }
}
