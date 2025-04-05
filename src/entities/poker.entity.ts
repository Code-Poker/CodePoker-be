import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Participant } from './participant.entity';

export type PokerDocument = HydratedDocument<Poker>;

@Schema()
export class Poker {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  participants: Participant[];

  @Prop()
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  constructor(id: string, name: string, participants: Participant[], startTime: Date, endTime: Date) {
    this.id = id;
    this.name = name;
    this.participants = participants;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  static fromDocument(pokerDocument: PokerDocument): Poker {
    return new Poker(
      pokerDocument._id.toString(),
      pokerDocument.name,
      pokerDocument.participants,
      pokerDocument.startTime,
      pokerDocument.endTime,
    );
  }
}

export const PokerSchema = SchemaFactory.createForClass(Poker);
