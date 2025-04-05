import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String], ref: 'Poker' })
  pokers: string[];

  constructor(id: string, name: string, description: string, pokers: string[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.pokers = pokers;
  }

  static fromDocument(groupDocument: GroupDocument): Group {
    return new Group(groupDocument._id.toString(), groupDocument.name, groupDocument.description, groupDocument.pokers);
  }
}

export const GroupSchema = SchemaFactory.createForClass(Group);
