import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PokerService } from './poker.service';
import { CreatePokerDto } from './dto/create-user.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('poker')
@ApiTags('Poker')
export class PokerController {
  constructor(private readonly pokerService: PokerService) {}

  @Post('create/:name')
  @ApiOperation({ summary: '포커 생성' })
  @ApiParam({ name: 'name', description: '포커 이름' })
  async create(
    @Param('name') name: string,
    @Body() createPokerDto: CreatePokerDto,
  ) {
    return this.pokerService.create(name, createPokerDto);
  }

  @Get('getAll')
  @ApiOperation({ summary: '포커 목록 조회' })
  async getAll() {
    return this.pokerService.getAll();
  }
}
