import { Connection } from 'mongoose';

import { ProblemSchema } from './schemas/problem.schema';

export const problemProviders = [
  {
    provide: 'PROBLEM_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Problem', ProblemSchema),
    inject: ['MONGODB'],
  },
];
