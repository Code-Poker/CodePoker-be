import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PokerModule } from './poker/poker.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { OauthModule } from './oauth/oauth.module';
import { ProblemModule } from './problem/problem.module';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
