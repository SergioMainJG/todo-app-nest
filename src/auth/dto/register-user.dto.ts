import { type } from "arktype";
import { zxcvbnInstance } from "../../lib/password-strength";

const fullName = type('string.capitalize.preformatted >= 8')
    .describe('Must be a capitalize string with at least 8 characters')
    .configure({
        expected: ctx => ctx.code === 'minLength' ? `${ctx.rule} characters or more` : `a string`,
    });

const email = type('string.email')
    .describe('Must be a valid email');

const password = type('/^\\S.{8,64}\\S$/')
    .describe('Must be longer than 8 characters and no using spaces as first and last character')
    .narrow((data, ctx) => {
        const result = zxcvbnInstance.check(data);
    if (result.score >= 3) return true;
    return ctx.mustBe(
      `a stronger password (${result.feedback.warning || 'too easy to guess'})`
    );
    })
    .configure({
        expected: ctx => ctx.code === 'predicate' ? 'harder to guess' : '',
        actual: () => '',
    });
    

export const RegisterUserDto = type({
    '+': 'reject',
    fullName: fullName,
    email: email,
    password: password,
});


export type RegisterUserDto = typeof RegisterUserDto.infer;