import { SchemaFactory } from '@nestjs/mongoose';

export class Problem {
  problemId: number;
  titleKo: string;
  level: number;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
