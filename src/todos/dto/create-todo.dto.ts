import { type } from "arktype";


export const title = type('3<=string.capitalize.preformatted<=50')
    .describe('Must be a capitalize string with length between 2 and 51');

export const description = type('10<=string<=200 ')
    .describe('Must be a valid description with length between 9 and 201');

export const status = type.enumerated(
        'INACTIVE',
        'IN_PROGRESS',
        'CANCELED',
        'DONE',
    )
    .describe('Must be a valid value prescripted in status');


export const CreateTodoDto = type({
    '+': 'reject',
    title: title,
    description: description,
    status: status.optional(),
});
export type CreateTodoDto = typeof CreateTodoDto.infer;