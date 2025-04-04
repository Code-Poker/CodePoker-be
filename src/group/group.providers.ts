import { Connection } from 'mongoose';

import { GroupSchema } from './entities/group.entity';

export const groupProviders = [
  {
    provide: 'GROUP_MODEL',
    useFactory: (connection: Connection) => connection.model('Group', GroupSchema),
    inject: ['MONGODB'],
  },
];
