import { Connection } from 'mongoose';

import { ProblemSchema } from './entities/problem.entity';

export const problemProviders = [
  {
    provide: 'PROBLEM_MODEL',
    useFactory: (connection: Connection) => connection.model('Problem', ProblemSchema),
    inject: ['MONGODB'],
  },
];
