import { ArkErrors } from "arktype";
import { LoginUserDto } from "./login-user.dto";

let commonBody = {
    email: 'algo@testing.com',
    password: '!Hola1234!',
};


describe('LoginUserDto test suite (inheritance from RegisterUserDto)', () => {

    describe('Email use cases', () => {
        it('Accepts email and password', () => {
            const result = LoginUserDto({ ...commonBody });
            expect(result).toEqual(commonBody);
        });
    });

    describe('fullName lack of use cases', () => {
        it('Reject fullName', () => {
            const result = LoginUserDto({ ...commonBody, fullName: 'Testing User' });
            expect(result).toBeInstanceOf(ArkErrors)
        })
    });

    describe('Reject use case', () => {
        it('Must reject this field', () => {
            const maliciousScript = LoginUserDto({ exec: '<alert>Hi!</alert>' });
            expect(maliciousScript).toBeInstanceOf(ArkErrors);
        });
    });
});