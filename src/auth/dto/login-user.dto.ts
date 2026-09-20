import { RegisterUserDto } from "./register-user.dto";


export const LoginUserDto = RegisterUserDto.omit('fullName');
export type LoginUserDto = typeof LoginUserDto.infer;