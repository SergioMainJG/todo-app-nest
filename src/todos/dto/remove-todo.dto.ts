import { type } from "arktype";


export const RemoveTodoDto = type({
   '+': 'reject',
    id: 'string.numeric.parse | number.integer > 0',
});
export type RemoveTodoDto = typeof RemoveTodoDto.infer;