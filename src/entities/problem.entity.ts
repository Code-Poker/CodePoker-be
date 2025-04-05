import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProblemDocument = HydratedDocument<Problem>;

@Schema()
export class Problem {
  problemId: number;
  titleKo: string;
  level: number;

  constructor(problemId: number, titleKo: string, level: number) {
    this.problemId = problemId;
    this.titleKo = titleKo;
    this.level = level;
  }

  static fromDocument(problemDocument: ProblemDocument): Problem {
    return new Problem(problemDocument.problemId, problemDocument.titleKo, problemDocument.level);
  }
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
