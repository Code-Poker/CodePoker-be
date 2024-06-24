import { Connection } from 'mongoose';

import { GroupSchema } from './schemas/group.schema';

export const groupProviders = [
  {
    provide: 'GROUP_MODEL',
    useFactory: (connection: Connection) => connection.model('Group', GroupSchema),
    inject: ['MONGODB'],
  },
];
