import { type } from "arktype";


const id = type('string.numeric.parse').to('number.integer > 0');

export const RemoveTodoDto = type({
   '+': 'reject',
    id: id,
});
export type RemoveTodoDto = typeof RemoveTodoDto.infer;