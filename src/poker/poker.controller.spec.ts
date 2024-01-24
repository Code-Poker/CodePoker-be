import { Test, TestingModule } from '@nestjs/testing';
import { PokerController } from './poker.controller';
import { PokerService } from './poker.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../database/database.module';

describe('PokerController', () => {
  let controller: PokerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HttpModule],
      controllers: [PokerController],
      providers: [PokerService],
    }).compile();

    controller = module.get<PokerController>(PokerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
