import { createClient } from 'redis';

export const databaseProviders = [
  {
    provide: 'REDIS',
    useFactory: async () => {
      const client = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
        password: process.env.REDIS_PASSWORD,
      });
      await client.connect();
      return client;
    },
  },
];
