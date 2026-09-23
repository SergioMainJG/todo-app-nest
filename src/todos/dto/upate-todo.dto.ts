import { CreateTodoDto } from "./create-todo.dto";

export const UpdateTodoDto = CreateTodoDto.partial();
export type UpdateTodoDto = typeof UpdateTodoDto.infer;
