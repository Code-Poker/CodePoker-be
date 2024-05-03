import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { BojModule } from './boj/boj.module';
import { DatabaseModule } from './database/database.module';
import { GroupModule } from './group/group.module';
import { PokerModule } from './poker/poker.module';
import { ProblemModule } from './problem/problem.module';
import { SolvedModule } from './solved/solved.module';
import { SsuModule } from './ssu/ssu.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 1000 * 10,
      max: 10,
    }),
    UserModule,
    PokerModule,
    DatabaseModule,
    ProblemModule,
    SsuModule,
    GroupModule,
    BojModule,
    SolvedModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
