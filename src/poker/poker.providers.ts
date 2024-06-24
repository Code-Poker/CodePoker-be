import { Connection } from 'mongoose';

import { PokerSchema } from './schemas/poker.schema';

export const pokerProviders = [
  {
    provide: 'POKER_MODEL',
    useFactory: (connection: Connection) => connection.model('Poker', PokerSchema),
    inject: ['MONGODB'],
  },
];
