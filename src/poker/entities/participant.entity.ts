import { SchemaFactory } from '@nestjs/mongoose';

import { Problem } from '../../problem/entities/problem.entity';

export class Participant {
  handle: string;
  profileImage: string;
  snapshot: number[];
  point: number;
  goal: number;
  result: Problem[];
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
