import { Test, TestingModule } from '@nestjs/testing';
import { PokerService } from './poker.service';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';

describe('PokerService', () => {
  let service: PokerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HttpModule],
      providers: [PokerService],
    }).compile();

    service = module.get<PokerService>(PokerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
