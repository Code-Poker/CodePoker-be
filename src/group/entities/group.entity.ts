import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class Group {
  @Prop({ type: ObjectId })
  @IsMongoId()
  id: string;

  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop()
  @IsString()
  description: string;

  @Prop({ type: [String], ref: 'Poker' })
  pokers: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
