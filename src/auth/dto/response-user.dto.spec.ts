import { ResponseUserDto } from "./response-user.dto";

let commonBody = {
    id: 1,
    token: 'safasf',
    email: 'algo@testing.com',
    password: '!Hola1234!',
};


describe('ResponseUserDto use case (inheritance from RegisterUserDto)', () => {

    describe('Remove password from the returning', () => {
        it('Remove only the password\'s field', () => {
            const result = ResponseUserDto({...commonBody});
            expect(result).not.toHaveProperty('password');
        });
    });
});