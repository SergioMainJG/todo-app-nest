import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
