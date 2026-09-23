import { TodosController } from './todos.controller';
import { Module } from '@nestjs/common';
import { TodosService } from './todos.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [ TodosController,],
  providers: [TodosService],
  imports: [PrismaModule],
  exports: [TodosService],
})
export class TodosModule {}
