import { ArkErrors } from "arktype";
import { CreateTodoDto } from "./create-todo.dto";


let commonBody = {
    title: 'Test Todo',
    description: 'Hello World from Mexico',
    status: 'DONE',
}

describe('CreateTodoDto test suite', () => {
    describe('Title use case', () => {
        it('Must accept a normal title capitalized', () => {
            const result = CreateTodoDto({ ...commonBody });

            expect(result).toEqual(commonBody);
        });

        it('Must reject a title no capitalized', () => {
            const result = CreateTodoDto({ ...commonBody, title: commonBody.title.toLowerCase() });
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a title with less than 3 character', () => {
            const result = CreateTodoDto({ ...commonBody, title: commonBody.title.slice(0, 2) });
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a title with more than 50 character', () => {
            const result = CreateTodoDto({ ...commonBody, title: commonBody.title.repeat(10) });
            expect(result).toBeInstanceOf(ArkErrors);
        });
    });

    describe('Description use case', () => {
        it('Must accept a normal description', () => {
            const result = CreateTodoDto({ ...commonBody });

            expect(result).toEqual(commonBody);
        });

        it('Must reject a description with less than 10 character', () => {
            const result = CreateTodoDto({ ...commonBody, description: commonBody.description.slice(0, 9) });
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a description with more than 200 character', () => {
            const result = CreateTodoDto({ ...commonBody, description: commonBody.description.repeat(100) });
            expect(result).toBeInstanceOf(ArkErrors);
        });
    });

    describe('Status use case', () => {

        it.each([
            'INACTIVE',
            'IN_PROGRESS',
            'CANCELED',
            'DONE',
        ])('Accepts %s as value', (status) => {

            const currentBody = { ...commonBody, status: status }
            const result = CreateTodoDto(currentBody);
            expect(result).toEqual(currentBody)
        });

        it('Rejects invalid status', () => {
            const result = CreateTodoDto({ ...commonBody, status: 'COMING' });
            expect(result).toBeInstanceOf(ArkErrors);
        });
    });

    describe('Reject use case', () => {
        it('Must reject this field', () => {
            const maliciousScript = CreateTodoDto({...commonBody, exec: '<alert>Hi!</alert>' });
            expect(maliciousScript).toBeInstanceOf(ArkErrors);
        });
    });
});