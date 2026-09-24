import { ArkErrors } from "arktype";
import { RegisterUserDto } from "./register-user.dto";


let commonBody = {
    fullName: 'Testing User',
    email: 'algo@testing.com',
    password: '!Hola1234!',
};


describe('RegisterUserDto test suite', () => {
    
    afterEach(() => {
        commonBody = {...commonBody};
    })

    describe('fullName field', () => {
        it('Must accept a normal fullname capitalized', () => {
            const result = RegisterUserDto({...commonBody});
            
            expect(result).toEqual(commonBody);
        });

        it('Must reject a fullname no capitalized', () => {
            const result = RegisterUserDto({...commonBody, fullName: commonBody.fullName.toLowerCase()});
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a fullname with less than 6 character', () => {
            const result = RegisterUserDto({...commonBody, fullName: commonBody.fullName.slice(0, 5)});
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a fullname with more than 76 character', () => {
            const result = RegisterUserDto({...commonBody, fullName: commonBody.fullName.repeat(10)});
            expect(result).toBeInstanceOf(ArkErrors);
        });
    });

    describe('email field', () => {
        it('Must accept a normal email', () => {
            const result = RegisterUserDto({...commonBody});
            
            expect(result).toEqual(commonBody);
        });

        it('Must reject a email without @', () => {
            const result = RegisterUserDto({...commonBody, email: commonBody.email.replace('@', '')});
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a email without username', () => {
            const atPosition = commonBody.email.indexOf('@');
            const result = RegisterUserDto({...commonBody, email: commonBody.email.slice(atPosition)});
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a email without extension', () => {
            const result = RegisterUserDto({...commonBody, email: commonBody.email.replace('.', '')});
            expect(result).toBeInstanceOf(ArkErrors);
        });
    });

    describe('password field', ()=> {
        it('Must accept accept a validd password', () => {
            const result = RegisterUserDto({...commonBody});
            expect(result).toEqual(commonBody);
        });

        it('Must reject a password with less than 8 characters', () => {
            const result = RegisterUserDto({...commonBody, password: commonBody.password.slice(0, 7)});
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a password with more than 64 characters', () => {
            const result = RegisterUserDto({...commonBody, password: commonBody.password.repeat(10)});
            expect(result).toBeInstanceOf(ArkErrors);
        });

        it('Must reject a common password like keyboard smashes, sequences, repetitions, dates, common words', () => {
            const keyboardSmashesResult = RegisterUserDto({...commonBody, password: 'qwertyuiop'});
            const sequencesResult = RegisterUserDto({...commonBody, password: 'abcdefghijklmno'});
            const repetitionsResult = RegisterUserDto({...commonBody, password: 'aaaaaaaaaaaaaaaaaaaa'});
            const dateResult = RegisterUserDto({...commonBody, password: 'Christmas'});
            const commonWordResult = RegisterUserDto({...commonBody, password: 'Constitution'});
            
            expect(keyboardSmashesResult).toBeInstanceOf(ArkErrors);
            expect(sequencesResult).toBeInstanceOf(ArkErrors);
            expect(repetitionsResult).toBeInstanceOf(ArkErrors);
            expect(dateResult).toBeInstanceOf(ArkErrors);
            expect(commonWordResult).toBeInstanceOf(ArkErrors);
        });
    });

    describe('Reject any other field',() => {
        it('Must reject this field', () => {
            const maliciousScript = RegisterUserDto({ exec: '<alert>Hi!</alert>' });
            expect(maliciousScript).toBeInstanceOf(ArkErrors);
        });
    });
});