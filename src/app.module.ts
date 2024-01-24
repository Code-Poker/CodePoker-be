import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PokerModule } from './poker/poker.module';

@Module({
  imports: [UserModule, PokerModule],
})
export class AppModule {}
