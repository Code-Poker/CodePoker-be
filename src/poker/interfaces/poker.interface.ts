import { Document } from 'mongoose';

import { IProblem } from '../../problem/interfaces/problem.interface';

export interface IParticipant extends Document {
  handle: string;
  profileImage: string;
  snapshot: number[];
  point: number;

  goal: number | null;
  tasksDone: boolean | null;
  result: IProblem[] | null;
}

export interface IPoker extends Document {
  id: string;
  name: string;
  tasks: number[];
  participants: IParticipant[];
  startDate: Date;
  endDate: Date;
}
