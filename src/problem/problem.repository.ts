import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemRepository {
  constructor(@Inject('PROBLEM_MODEL') private readonly problemModel: Model<Problem>) {}

  create(problem: Problem) {
    return new this.problemModel(problem).save();
  }

  getAll() {
    return this.problemModel.find().exec();
  }

  get(problemId: number) {
    return this.problemModel.findOne({ problemId }).exec();
  }

  update(problemId: number, problem: Problem) {
    return this.problemModel.findOneAndUpdate({ problemId }, problem).exec();
  }

  deleteAll() {
    return this.problemModel.deleteMany().exec();
  }

  delete(problemId: number) {
    return this.problemModel.deleteOne({ problemId }).exec();
  }
}
