import { ArkErrors } from "arktype";
import { UpdateTodoDto } from "./update-todo.dto";


let commonBody = {
    title: 'Test Todo',
    description: 'Hello World from Mexico',
    status: 'DONE',
}

describe('UpdateTodoDto test suite (inheritance from CreateTodoDto)', () => {
    describe('Reject use case', () => {
        it('Must reject this field', () => {
            const maliciousScript = UpdateTodoDto({...commonBody, exec: '<alert>Hi!</alert>' });
            expect(maliciousScript).toBeInstanceOf(ArkErrors);
        });

        it('Must reject void objects', () => {
            const nothing = UpdateTodoDto({});
            expect(nothing).toBeInstanceOf(ArkErrors);
        })
    });
});