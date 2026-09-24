import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards, Get, UseFilters} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { RemoveTodoDto } from './dto/remove-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import type { AuthPayload } from '../types/auth-payload';
import { PrismaExceptionsFilter } from '../shared/prisma-exceptions-filter/prisma-exceptions.filter';

@UseGuards(AuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}


  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthPayload,
  ){
    return await this.todosService.findById(id, user.id);
  }

  @Post()
  @UseFilters(PrismaExceptionsFilter)
  async create(
    @Body() createTodosDto: CreateTodoDto,
    @GetUser() user: AuthPayload,
  ) {
    return await this.todosService.create(createTodosDto, user.id);
  }

  @Delete(':id')
  async remove(
    @Param({ schema: RemoveTodoDto}) removeTodoDto: RemoveTodoDto,
    @GetUser() user: AuthPayload,
  ){
    return await this.todosService.delete(removeTodoDto, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body({schema: UpdateTodoDto}) updateTodoDto: UpdateTodoDto,
    @GetUser() user: AuthPayload, 
  ){
    return await this.todosService.update(id, updateTodoDto, user.id);
  }
}