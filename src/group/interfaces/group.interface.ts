import { Document } from 'mongoose';

export interface IGroup extends Document {
  readonly name: string;
  readonly description: string;
  readonly pokers: string[];
}
