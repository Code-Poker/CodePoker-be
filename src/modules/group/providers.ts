import { GroupSchema } from '@entities/group.entity';
import { Connection } from 'mongoose';

export const groupProviders = [
  {
    provide: 'GROUP_MODEL',
    useFactory: (connection: Connection) => connection.model('Group', GroupSchema),
    inject: ['MONGODB'],
  },
];
