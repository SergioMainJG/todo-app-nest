import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TodosModule } from '../todos/todos.module.js';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, TodosModule],
  exports: [UserService],
})
export class UserModule {}
