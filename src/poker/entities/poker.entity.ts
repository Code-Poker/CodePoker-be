import { Problem } from '../../problem/entities/problem.entity';

export class Participant {
  handle: string;
  profileImage: string;
  snapshot: number[];
  point: number;

  goal: number | null;
  tasksDone: boolean | null;
  result: Problem[] | null;
}

export class Poker {
  id: string;
  name: string;
  tasks: number[];
  participants: Participant[];
  startDate: Date;
  endDate: Date;
}
