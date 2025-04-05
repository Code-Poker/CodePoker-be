import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Problem } from './problem.entity';

export type ParticipantDocument = HydratedDocument<Participant>;

@Schema()
export class Participant {
  @Prop({ required: true })
  handle: string;

  @Prop({ required: true })
  profileImage: string;

  @Prop({ required: true })
  snapshot: number[];

  @Prop({ required: true })
  point: number;

  @Prop({ required: true })
  goal: number;

  @Prop({ required: true })
  result: Problem[];

  constructor(
    handle: string,
    profileImage: string,
    snapshot: number[],
    point: number,
    goal: number,
    result: Problem[],
  ) {
    this.handle = handle;
    this.profileImage = profileImage;
    this.snapshot = snapshot;
    this.point = point;
    this.goal = goal;
    this.result = result;
  }

  static fromDocument(participantDocument: ParticipantDocument): Participant {
    return new Participant(
      participantDocument.handle,
      participantDocument.profileImage,
      participantDocument.snapshot,
      participantDocument.point,
      participantDocument.goal,
      participantDocument.result,
    );
  }
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
