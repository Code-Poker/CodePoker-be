import { Poker } from '@entities/poker.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { GroupRepository } from '../group/repository';

@Injectable()
export class PokerRepository {
  constructor(
    @Inject('POKER_MODEL') private readonly pokerModel: Model<Poker>,
    private readonly groupRepository: GroupRepository,
  ) {}

  create(poker: Poker): Promise<Poker> {
    const createdPoker = new this.pokerModel(poker);
    return createdPoker.save();
  }

  getAll(): Promise<Poker[]> {
    return this.pokerModel.find();
  }

  async get(id: string): Promise<Poker> {
    const poker = (await this.pokerModel.findById(id)) as Poker;
    if (!poker) {
      throw new Error(`Poker not found: ${id.toString()}`);
    }

    return poker;
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

  async deleteAll(): Promise<void> {
    await this.pokerModel.deleteMany({}).exec().then();
  }

  delete(id: string): void {
    this.pokerModel.deleteOne({ _id: id });
  }
}
