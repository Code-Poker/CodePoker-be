import { Schema } from 'mongoose';

export const ProblemSchema = new Schema({
  problemId: Number,
  titleKo: String,
  level: Number,
});
