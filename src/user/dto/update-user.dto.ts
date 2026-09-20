import { RegisterUserDto } from "../../auth/dto/register-user.dto";

export const UpdateUserDto = RegisterUserDto.omit('fullName');

export type UpdateUserDto = typeof UpdateUserDto.infer;