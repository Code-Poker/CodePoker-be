import { Participant } from '@entities/participant.entity';
import { Poker } from '@entities/poker.entity';
import { CreatePokerDto } from '@modules/poker/dto/create-poker.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PokerRepository {
  constructor(@Inject('POKER_MODEL') private readonly pokerModel: Model<Poker>) {}

  async create(createPokerDto: CreatePokerDto, participants: Participant[]): Promise<Poker> {
    const pokerDoc = new this.pokerModel({
      name: createPokerDto.name,
      participants: participants,
      startTime: new Date(),
      endTime: createPokerDto.endDate,
    });

    return Poker.fromDocument(await pokerDoc.save());
  }

  async getAll(): Promise<Poker[]> {
    const pokerDocs = await this.pokerModel.find().exec();
    if (!pokerDocs) {
      throw new Error('No pokers found');
    }

    return pokerDocs.map((document) => Poker.fromDocument(document));
  }

  async get(id: string): Promise<Poker> {
    const pokerDoc = await this.pokerModel.findById(id);
    if (!pokerDoc) {
      throw new Error(`Poker not found: ${id.toString()}`);
    }

    return Poker.fromDocument(pokerDoc);
  }

  async update(id: string, poker: Poker): Promise<Poker> {
    const pokerDoc = await this.pokerModel.findByIdAndUpdate(id, poker);
    if (!pokerDoc) {
      throw new Error(`Poker not found: ${id}`);
    }

    return Poker.fromDocument(pokerDoc);
  }

  async deleteAll(): Promise<void> {
    await this.pokerModel.deleteMany({}).exec().then();
  }

  delete(id: string): void {
    this.pokerModel.deleteOne({ _id: id });
  }
}
