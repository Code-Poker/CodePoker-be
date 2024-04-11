import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { GroupRepository } from '../group/group.repository';
import { Poker } from './entities/poker.entity';
import { IPoker } from './interfaces/poker.interface';

@Injectable()
export class PokerRepository {
  constructor(
    @Inject('POKER_MODEL') private readonly pokerModel: Model<IPoker>,
    private readonly groupRepository: GroupRepository,
  ) {}

  create(poker: Poker): Promise<IPoker> {
    return this.pokerModel.create(poker);
  }

  getAll(): Promise<IPoker[]> {
    return this.pokerModel.find();
  }

  get(id: string): Promise<IPoker> {
    return this.pokerModel.findById(id);
  }

  validate(id: string, poker: Poker): void {
    if (!poker) {
      throw new Error(`Poker not found: ${id}`);
    }
  }

  update(id: string, poker: Poker): void {
    this.pokerModel.updateOne(
      {
        _id: id,
      },
      poker,
    );
  }

  deleteAll(): void {
    this.pokerModel.deleteMany({}).exec().then();
  }

  delete(id: string): void {
    this.pokerModel.deleteOne({ _id: id });
  }
}
