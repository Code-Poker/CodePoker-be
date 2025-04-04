import { ProblemSchema } from '@entities/problem.entity';
import { Connection } from 'mongoose';

export const problemProviders = [
  {
    provide: 'PROBLEM_MODEL',
    useFactory: (connection: Connection) => connection.model('Problem', ProblemSchema),
    inject: ['MONGODB'],
  },
];
