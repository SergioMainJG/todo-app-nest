import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule, UserModule],
})
export class AuthModule {}
