import { Document } from 'mongoose';

export interface IProblem extends Document {
  problemId: number;
  titleKo: string;
  level: number;
}
