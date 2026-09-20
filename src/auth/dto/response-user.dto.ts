import { type } from "arktype";
import { RegisterUserDto } from "./register-user.dto";

const token = type('string');
const id = type('number.integer > 0');

export const ResponseUserDto = RegisterUserDto
    .omit('password')
    .merge({id: id,token: token, '+': 'delete'});
export type ResponseUserDto = typeof ResponseUserDto.infer;