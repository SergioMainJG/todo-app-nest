import { ArkErrors } from "arktype";
import { RemoveTodoDto } from "./remove-todo.dto";

let commonBody = {
    id: '1',
};


describe('RemoveTodoDto test suite (inheritance from RegisterUserDto)', () => {

    describe('Id use case', () => {
        it('Accepts a valid id', () => {
            const result = RemoveTodoDto({ ...commonBody });
            expect(result).toHaveProperty('id');
        });

        it('Rejects a invalid id', () => {
            const result = RemoveTodoDto({id:'-1' });
            expect(result).toBeInstanceOf(ArkErrors);
        });
    });

    describe('Reject use case', () => {
        it('Must reject this field', () => {
            const maliciousScript = RemoveTodoDto({...commonBody, exec: '<alert>Hi!</alert>' });
            expect(maliciousScript).toBeInstanceOf(ArkErrors);
        });
    });
});