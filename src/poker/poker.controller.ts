import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PokerService } from './poker.service';
import { CreatePokerDto } from './dto/create-poker.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdatePokerDto } from './dto/update-poker.dto';
import { AppendParticipantDto } from './dto/append-participant.dto';

@Controller('poker')
@ApiTags('Poker')
export class PokerController {
  constructor(private readonly pokerService: PokerService) {}

  @Post(':name')
  @ApiOperation({ summary: '포커 생성' })
  @ApiParam({ name: 'name', description: '포커 이름' })
  async create(
    @Param('name') name: string,
    @Body() createPokerDto: CreatePokerDto,
  ) {
    return this.pokerService.create(name, createPokerDto);
  }

  @Get('')
  @ApiOperation({ summary: '포커 목록 조회' })
  async getAll() {
    return this.pokerService.getAll();
  }

  @Get('recent')
  @ApiOperation({ summary: '최근 포커 결과 조회' })
  async getRecent() {
    return this.pokerService.getRecent();
  }

  @Get(':pokerId')
  @ApiOperation({ summary: '포커 조회' })
  @ApiParam({ name: 'pokerId', description: '포커 id' })
  async get(@Param('pokerId') pokerId: string) {
    return this.pokerService.get(pokerId);
  }

  @Post(':pokerId/append')
  @ApiOperation({ summary: '포커 참가자 추가' })
  @ApiParam({ name: 'pokerId', description: '포커 id' })
  async appendParticipant(
    @Param('pokerId') pokerId: string,
    @Body() appendParticipantDto: AppendParticipantDto,
  ) {
    return this.pokerService.appendParticipant(pokerId, appendParticipantDto);
  }

  @Patch(':pokerId/goal')
  @ApiOperation({ summary: '포커 목표 점수 수정' })
  @ApiParam({ name: 'pokerId', description: '포커 id' })
  async updateGoal(
    @Param('pokerId') pokerId: string,
    @Body() updatePokerDto: UpdatePokerDto,
  ) {
    return this.pokerService.updateGoal(pokerId, updatePokerDto);
  }

  @Get(':pokerId/calc')
  @ApiOperation({ summary: '포커 결과 계산' })
  @ApiParam({ name: 'pokerId', description: '포커 id' })
  async calc(@Param('pokerId') pokerId: string) {
    return this.pokerService.calc(pokerId);
  }

  @Get(':pokerId/refresh')
  @ApiOperation({ summary: '포커 결과 갱신' })
  @ApiParam({ name: 'pokerId', description: '포커 id' })
  async refresh(@Param('pokerId') pokerId: string) {
    return this.pokerService.refresh(pokerId);
  }
}
