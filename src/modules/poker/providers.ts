import { PokerSchema } from '@entities/poker.entity';
import { Connection } from 'mongoose';

export const pokerProviders = [
  {
    provide: 'POKER_MODEL',
    useFactory: (connection: Connection) => connection.model('Poker', PokerSchema),
    inject: ['MONGODB'],
  },
];
