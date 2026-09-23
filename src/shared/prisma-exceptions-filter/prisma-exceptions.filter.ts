import { ArgumentsHost, BadRequestException, Catch, ConflictException, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Response } from "express";

const prismaErrors = new Map<string, HttpException>([
  ['P2002', new ConflictException('The current data already exists')],
  ['P2000', new BadRequestException('The current data exceeds the long')],
  ['P2003', new ConflictException('The property related to the current object doesn\'t exists. Please, create the other property first')]
]);


@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionsFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
  
    const currentError = prismaErrors.get(exception.code);

    
    if(!currentError){
      super.catch(exception, host);
      return;
    }
    
    const resp = host.switchToHttp().getResponse<Response>();

    resp
      .status(currentError.getStatus())
      .json({
         statusCode: currentError?.getStatus(),
         error: currentError?.message
      });
  }
}
