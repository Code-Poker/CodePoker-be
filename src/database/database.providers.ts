import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'MONGODB',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.MONGODB_URI),
  },
];
