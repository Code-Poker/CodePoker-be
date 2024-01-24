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

  @Get('get/:id')
  @ApiOperation({ summary: '포커 조회' })
  @ApiParam({ name: 'id', description: '포커 id' })
  async get(@Param('id') id: string) {
    return this.pokerService.get(id);
  }

  @Get('calc/:id')
  @ApiOperation({ summary: '포커 결과 계산' })
  @ApiParam({ name: 'id', description: '포커 id' })
  async calc(@Param('id') id: string) {
    return this.pokerService.calc(id);
  }
}
