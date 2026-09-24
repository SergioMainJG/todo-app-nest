import { ConflictException, NotFoundException } from "@nestjs/common";
import { CreateTodoDto, description } from "./dto/create-todo.dto";
import { TodosService } from "./todos.service";
import { Status } from "../generated/prisma/enums";
import { RemoveTodoDto } from "./dto/remove-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";


describe('TodosService test suite', () => {
    let service: TodosService;
    const prismaMock = {
        todos: {
            findFirst: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        service = new TodosService(
            prismaMock as any
        );
    });

    describe('findByTitle use case', () => {

        it('Return the todo when the userId and the title exists (a user exists and has that todo)', async () => {
            const testTitle = 'Test Todo';
            const userId = 1;

            const todo = {
                id: 1,
                title: testTitle,
                description: 'Some description',
                status: 'INACTIVE',
                author: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.todos.findFirst.mockResolvedValue(todo);
            const result = await service.findByTitle(testTitle, userId);
            

            expect(prismaMock.todos.findFirst).toHaveBeenCalledWith({
                where:{
                    AND:[
                        {title: testTitle},
                        {author: userId}
                    ]
                }
            });
            expect(result).toEqual(todo);
        });

        it('Return the todo as null when the userId and the title doesn\'t match or exists (a user exists but not has that todo)', async () => {
            const testTitle = 'Test Todo';
            const userId = 1;

            prismaMock.todos.findFirst.mockResolvedValue(null);
            const result = await service.findByTitle(testTitle, userId);
            

            expect(prismaMock.todos.findFirst).toHaveBeenCalledWith({
                where:{
                    AND:[
                        {title: testTitle},
                        {author: userId}
                    ]
                }
            });
            expect(result).toEqual(null);
        });
    });

    describe('findById use case', () => {

        it('Return the todo when the userId and todoId exists (a user exists and has that todo)', async () => {
            const todoId = 1;
            const userId = 1;

            const todo = {
                id: todoId,
                title: 'Test Todo',
                description: 'Some description',
                status: 'INACTIVE',
                author: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.todos.findFirst.mockResolvedValue(todo);
            const result = await service.findById(todoId, userId);
            

            expect(prismaMock.todos.findFirst).toHaveBeenCalledWith({
                where:{
                    AND:[
                        {id:todoId},
                        {author: userId}
                    ]
                }
            });
            expect(result).toEqual(todo);
        });

        it('Return the todo as null when the userId and the todoId doesn\'t match or exists (a user exists but not has that todo)', async () => {
            const todoId = 1;
            const userId = 1

            prismaMock.todos.findFirst.mockResolvedValue(null);
            const result = await service.findById(todoId, userId);
            

            expect(prismaMock.todos.findFirst).toHaveBeenCalledWith({
                where:{
                    AND:[
                        {id:todoId},
                        {author: userId}
                    ]
                }
            });
            expect(result).toEqual(null);
        });
    });

    describe('create todo use case', () => {
        
        it('Must create correctly the todo', async () =>{
            const dto = { title: 'Test Title', description: 'A random testing for todo', status: 'INACTIVE' };
            const userId = 1;
            const todoDto = CreateTodoDto.assert(dto);


            const todo = {
                id: 1,
                title: todoDto.title,
                description: todoDto.description,
                status: todoDto.status,
                author: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const spyFindByTitle = vi.spyOn(service, 'findByTitle');
            spyFindByTitle.mockResolvedValue(null);
            prismaMock.todos.create.mockResolvedValue(todo);
            const result = await service.create(todoDto, userId);


            expect(spyFindByTitle).toHaveBeenCalledWith(todoDto.title, userId);
            expect(prismaMock.todos.create).toHaveBeenCalledWith({
                    data: {
                    title: todo.title,
                    description: todo.description,
                    status: todo.status,
                    author: userId,
                },
            });
            expect(result).toEqual(todo);
        });
        
        it('Must throw Conflic Exception if a todo is registered with that title for that user', async () =>{
            const dto = { title: 'Test Title', description: 'A random testing for todo', status: 'INACTIVE' };
            const userId = 1;
            const todoDto = CreateTodoDto.assert(dto);


            const todo = {
                id: 1,
                title: todoDto.title,
                description: todoDto.description,
                status: todoDto.status as Status,
                author: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const spyFindByTitle = vi.spyOn(service, 'findByTitle');
            spyFindByTitle.mockResolvedValue(todo);

            await expect(service.create(todoDto, userId)).rejects.toThrow(ConflictException);
            expect(spyFindByTitle).toHaveBeenCalledWith(todoDto.title, userId);
        });
    });

    describe('delete todo use case', () => {
        
        it('Must delete correctly the todo', async () =>{
            const dto = { id: '1'};
            const userId = 1;
            const todoDto = RemoveTodoDto.assert(dto);


            const todo = {
                id: 1,
                title: 'Todo Test',
                description: 'Testing randdom for todo',
                status: 'INACTIVE' as Status,
                author: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const spyFindById = vi.spyOn(service, 'findById');
            spyFindById.mockResolvedValue(todo);
            prismaMock.todos.create.mockResolvedValue(todo);
            const result = await service.delete(todoDto, userId);


            expect(spyFindById).toHaveBeenCalledWith(todoDto.id, userId);
            expect(prismaMock.todos.delete).toHaveBeenCalledWith({
                where: {
                    title_author: {title: todo.title, author: userId}
                },
            });
            expect(result).toEqual(null);
        });
        
        it('Must return null even if the todo doesn\'t exists', async () =>{
            const dto = { id: '1' };
            const userId = 1;
            const todoDto = RemoveTodoDto.assert(dto);

            const todo = null;

            const spyFindById = vi.spyOn(service, 'findById');
            spyFindById.mockResolvedValue(todo);
            
            const result = await service.delete(todoDto, userId);

            expect(spyFindById).toHaveBeenCalledWith(todoDto.id, userId);
            expect(result).toEqual(todo);
        });
    });

    describe('upate todo use case', () => {
        
        it('Must update correctly the todo (title)', async () =>{
            const todoId = 1;
            const dto = { title: 'Test Title 2'};
            const userId = 1;
            const todoDto = UpdateTodoDto.assert(dto);

            const todoFromDB = {
                id: 1,
                title: 'Test Title',
                description: 'HELlo World!"#$',
                status: 'IN_PROGRESS' as Status,
                author: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const todoResult = {
                id: 1,
                title: todoDto.title,
                description: todoFromDB.description,
                status: todoFromDB.status,
                author: userId,
                createdAt: todoFromDB.createdAt,
                updatedAt: new Date(),
            };

            const spyFindById = vi.spyOn(service, 'findById');
            spyFindById.mockResolvedValue(todoFromDB);
            prismaMock.todos.update.mockResolvedValue(todoResult);
            const result = await service.update(todoId, todoDto, userId);

            expect(spyFindById).toHaveBeenCalledWith(todoId, userId);
            expect(prismaMock.todos.update).toHaveBeenCalledWith({
                data: {...todoDto},
                where: {
                    title_author: {title: todoFromDB.title, author: userId}
                }
            });
            expect(result).toEqual(todoResult);
        });
        
        it('Must update correctly the todo (description)', async () =>{
            const todoId = 1;
            const dto = { description: 'Hello World, guys!'};
            const userId = 1;
            const todoDto = UpdateTodoDto.assert(dto);

            const todoFromDB = {
                id: 1,
                title: 'Test Title',
                description: 'HELlo World!"#$',
                status: 'IN_PROGRESS' as Status,
                author: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const todoResult = {
                id: 1,
                title: todoFromDB.title,
                description: todoDto.description,
                status: todoFromDB.status,
                author: userId,
                createdAt: todoFromDB.createdAt,
                updatedAt: new Date(),
            };

            const spyFindById = vi.spyOn(service, 'findById');
            spyFindById.mockResolvedValue(todoFromDB);
            prismaMock.todos.update.mockResolvedValue(todoResult);
            const result = await service.update(todoId, todoDto, userId);

            expect(spyFindById).toHaveBeenCalledWith(todoId, userId);
            expect(prismaMock.todos.update).toHaveBeenCalledWith({
                data: {...todoDto},
                where: {
                    title_author: {title: todoFromDB.title, author: userId}
                }
            });
            expect(result).toEqual(todoResult);
        });

        it('Must update correctly the todo (status)', async () =>{
            const todoId = 1;
            const dto = { status: 'INACTIVE'};
            const userId = 1;
            const todoDto = UpdateTodoDto.assert(dto);

            const todoFromDB = {
                id: 1,
                title: 'Test Title',
                description: 'HELlo World!"#$',
                status: 'IN_PROGRESS' as Status,
                author: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const todoResult = {
                id: 1,
                title: todoFromDB.title,
                description: todoFromDB.description,
                status: todoDto.status,
                author: userId,
                createdAt: todoFromDB.createdAt,
                updatedAt: new Date(),
            };

            const spyFindById = vi.spyOn(service, 'findById');
            spyFindById.mockResolvedValue(todoFromDB);
            prismaMock.todos.update.mockResolvedValue(todoResult);
            const result = await service.update(todoId, todoDto, userId);

            expect(spyFindById).toHaveBeenCalledWith(todoId, userId);
            expect(prismaMock.todos.update).toHaveBeenCalledWith({
                data: {...todoDto},
                where: {
                    title_author: {title: todoFromDB.title, author: userId}
                }
            });
            expect(result).toEqual(todoResult);
        });

        it('Must throw  Not Found Exception if the todo doesn\'t exists', async () =>{
            const todoId = 1;
            const dto = { status: 'INACTIVE'};
            const userId = 1;
            const todoDto = UpdateTodoDto.assert(dto);

            const todoFromDB = null;

            const spyFindById = vi.spyOn(service, 'findById');
            spyFindById.mockResolvedValue(todoFromDB);
            

            await expect(service.update(todoId, todoDto, userId)).rejects.toThrow(NotFoundException);
            expect(spyFindById).toHaveBeenCalledWith(todoId, userId);
        });
    });
});