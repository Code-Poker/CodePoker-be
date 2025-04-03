import { Connection } from 'mongoose';

import { PokerSchema } from './entities/poker.entity';

export const pokerProviders = [
  {
    provide: 'POKER_MODEL',
    useFactory: (connection: Connection) => connection.model('Poker', PokerSchema),
    inject: ['MONGODB'],
  },
];
