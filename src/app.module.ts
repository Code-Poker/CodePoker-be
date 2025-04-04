import { DatabaseModule } from '@database/database.module';
import { BojModule } from '@modules/boj/module';
import { GroupModule } from '@modules/group/module';
import { PokerModule } from '@modules/poker/module';
import { ProblemModule } from '@modules/problem/module';
import { SolvedModule } from '@modules/solved/module';
import { SsuModule } from '@modules/ssu/module';
import { UserModule } from '@modules/user/module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
