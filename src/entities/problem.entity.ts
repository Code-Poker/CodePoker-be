import { SchemaFactory } from '@nestjs/mongoose';

export class Problem {
  problemId: number;
  titleKo: string;
  level: number;

  constructor(problem: { problemId: number; titleKo: string; level: number }) {
    this.problemId = problem.problemId;
    this.titleKo = problem.titleKo;
    this.level = problem.level;
  }
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
