import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PokerModule } from './poker/poker.module';
import { DatabaseModule } from './database/database.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { OauthModule } from './oauth/oauth.module';
import { ProblemModule } from './problem/problem.module';
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
    OauthModule,
    ProblemModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
