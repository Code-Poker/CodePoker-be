import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreatePokerDto } from './dto/create-poker.dto';
import { PokerService } from './poker.service';

@Controller('poker')
@ApiTags('Poker')
export class PokerController {
  constructor(private readonly pokerService: PokerService) {}

  @Post()
  @ApiOperation({ summary: '포커 생성' })
  @ApiQuery({
    name: 'name',
    description: '포커 이름',
  })
  async create(
    @Query('name') name: string,
    @Body() createPokerDto: CreatePokerDto,
  ) {
    return this.pokerService.create(name, createPokerDto);
  }

  @Get()
  @ApiOperation({ summary: '포커 목록 조회' })
  async getAll() {
    return this.pokerService.getAll();
  }

  @Delete()
  @ApiOperation({ summary: '포커 전체 삭제' })
  async deleteAll() {
    return this.pokerService.deleteAll();
  }

  @Get(':pokerId')
  @ApiOperation({ summary: '포커 조회' })
  @ApiParam({ name: 'pokerId', description: '포커 id' })
  async get(@Param('pokerId') pokerId: string) {
    return this.pokerService.get(pokerId);
  }

  //
  // @Patch(':pokerId/refresh')
  // @ApiOperation({ summary: '포커 결과 갱신' })
  // @ApiParam({ name: 'pokerId', description: '포커 id' })
  // async refresh(@Param('pokerId') pokerId: string) {
  //   return this.pokerService.refresh(pokerId);
  // }
}
