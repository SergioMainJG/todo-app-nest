import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { Request } from "express";
import { AuthPayload } from '../../types/auth-payload'

export const GetUser = createParamDecorator(( data: keyof AuthPayload, ctx: ExecutionContext ) =>{
  const user = ctx.switchToHttp().getRequest<Request>()['user'];

  if(!user)
    throw new InternalServerErrorException('User not found in exception');

  return data ? user[data] : user;
})
