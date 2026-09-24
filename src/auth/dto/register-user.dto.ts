import { type } from "arktype";
import { zxcvbnInstance } from "../../lib/password-strength";

const fullName = type('5 < string.capitalize.preformatted < 76')
    .describe('Must be a capitalize string with at least 5 characters')
    .configure({
        expected: ctx => ctx.code === 'minLength' ? `${ctx.rule} characters or more` : `a string`,
    });

const email = type('string.email')
    .describe('Must be a valid email');

const password = type('/^\\S.{8,64}\\S$/')
    .describe('Must be longer than 7 characters and no using spaces as first and last character and have less than 65 characters')
    .narrow((data, ctx) => {
        const result = zxcvbnInstance.check(data);
    if (result.score >= 3) return true;
    return ctx.mustBe(
      `a stronger password (${result.feedback.warning || 'too easy to guess'})`
    );
    })
    .configure({
        expected: ctx => ctx.code === 'predicate' ? 'harder to guess' : 'more large',
        actual: () => '',
    });
    

export const RegisterUserDto = type({
    '+': 'reject',
    fullName: fullName,
    email: email,
    password: password,
});


export type RegisterUserDto = typeof RegisterUserDto.infer;