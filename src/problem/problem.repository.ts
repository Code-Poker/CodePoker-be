import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { IProblem } from './interfaces/problem.interface';

@Injectable()
export class ProblemRepository {
  constructor(
    @Inject('PROBLEM_MODEL') private readonly problemModel: Model<IProblem>,
  ) {}

  create(problem: IProblem) {
    return new this.problemModel(problem).save();
  }

  getAll(): Promise<IProblem[]> {
    return this.problemModel.find().exec();
  }

  get(problemId: number): Promise<IProblem> {
    return this.problemModel.findOne({ problemId }).exec();
  }

  update(problemId: number, problem: IProblem): Promise<IProblem> {
    return this.problemModel.findOneAndUpdate({ problemId }, problem).exec();
  }

  deleteAll() {
    return this.problemModel.deleteMany().exec();
  }

  delete(problemId: number) {
    return this.problemModel.deleteOne({ problemId }).exec();
  }
}
