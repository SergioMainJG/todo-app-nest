import { CreateTodoDto } from "./create-todo.dto";

export const UpdateTodoDto = CreateTodoDto
    .partial()
    .onUndeclaredKey('reject')
    .narrow((data, ctx) =>
        Object.keys(data).length > 0 || ctx.mustBe('an object with at least one property')
    );
export type UpdateTodoDto = typeof UpdateTodoDto.infer;
