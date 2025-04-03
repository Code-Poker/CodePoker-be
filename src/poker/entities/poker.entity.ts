import { Prop, SchemaFactory } from '@nestjs/mongoose';

import { Participant } from './participant.entity';

export class Poker {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  participants: Participant[];

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;
}

export const PokerSchema = SchemaFactory.createForClass(Poker);
