import * as mongoose from 'mongoose';

import { ProblemSchema } from '../../problem/schemas/problem.schema';

export const ParticipantSchema = new mongoose.Schema({
  handle: String,
  profileImage: String,
  snapshot: [Number],
  point: Number,

  goal: { type: Number, required: false },
  tasksDone: { type: Boolean, required: false },
  result: { type: [ProblemSchema], required: false },
});

export const PokerSchema = new mongoose.Schema({
  name: String,
  tasks: [Number],
  participants: [ParticipantSchema],
  startTime: Date,
  endTime: Date,
});
