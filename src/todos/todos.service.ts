import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';
import { RemoveTodoDto } from "./dto/remove-todo.dto";
import { UpdateTodoDto } from './dto/update-todo.dto';

type Todo = Prisma.TodosGetPayload<{include:{user: false}}>

@Injectable()
export class TodosService {
    constructor(private readonly prismaService: PrismaService){}

    async findByTitle(title: string, userId: number): Promise<Todo|null>{
        const todoFromDB = await this.prismaService.todos.findFirst({
            where: {
                AND: [
                    {title: title},
                    {author: userId}
                ]
            }
        });
        return todoFromDB;
    }

    async findById(id: number, userId: number): Promise<Todo|null>{
         const todoFromDB = await this.prismaService.todos.findFirst({
            where: {
                AND: [
                    {id: id},
                    {author: userId}
                ]
            }
        });
        return todoFromDB;
    }

    async create(
        {description, status, title}: CreateTodoDto,
        userId: number,
    ): Promise<Todo> {
        const todoFromDB = await this.findByTitle(title, userId);
        if( todoFromDB )
            throw new ConflictException('A todo with that title already exists for that user');

        const todo = await this.prismaService.todos.create({
            data: {
                title: title,
                description: description,
                status: status,
                author: userId
            }
        });

        return todo;
    }

    async delete({id}: RemoveTodoDto, userId: number ): Promise<null>{

        const todoFromDB = await this.findById(id, userId);

        if(!todoFromDB) return null;

        await this.prismaService.todos.delete({
            where: {
                title_author: {title: todoFromDB.title, author: userId}
            },
        });

        return null;
    }


    async update(
        todoId: number, updateTodoDto: UpdateTodoDto, userId: number
    ):Promise<Todo>{
        const todoFromDB = await this.findById(todoId, userId);
        if(!todoFromDB)
            throw new NotFoundException(`Todo with id: ${todoId} doesn't exists for user with id: ${userId}`);

        const todo = await this.prismaService.todos.update({
            data: {...updateTodoDto},
            where: {
                title_author: {title: todoFromDB.title, author: userId}
            }
        });

        return todo;
    }
}
