import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { FILTER_CATCH_EXCEPTIONS } from '@nestjs/common/constants';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaExceptionsFilter } from './prisma-exceptions.filter';

const prismaError = (code: string) =>
  new PrismaClientKnownRequestError(`Prisma error ${code}`, { code, clientVersion: 'test' });

const mockHost = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  const host = {
    switchToHttp: () => ({ getResponse: () => res }),
  } as unknown as ArgumentsHost;

  return { res, host };
};

describe('PrismaExceptionsFilter test suite', () => {
  const filter = new PrismaExceptionsFilter();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is registered to catch PrismaClientKnownRequestError', () => {
    expect(Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, PrismaExceptionsFilter)).toEqual([
      PrismaClientKnownRequestError,
    ]);
  });

  it.each([
    ['P2002', HttpStatus.CONFLICT, 'The current data already exists'],
    ['P2000', HttpStatus.BAD_REQUEST, 'The current data exceeds the long'],
    [
      'P2003',
      HttpStatus.CONFLICT,
      "The property related to the current object doesn't exists. Please, create the other property first",
    ],
  ])('maps %s to HTTP %i', (code, status, message) => {
    const { res, host } = mockHost();
    const superCatch = vi.spyOn(BaseExceptionFilter.prototype, 'catch');

    filter.catch(prismaError(code), host);

    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({ statusCode: status, error: message });
    expect(superCatch).not.toHaveBeenCalled();
  });

  it('delegates unregistered codes to BaseExceptionFilter', () => {
    const { res, host } = mockHost();
    const superCatch = vi
      .spyOn(BaseExceptionFilter.prototype, 'catch')
      .mockImplementation(() => {});
    const error = prismaError('P2025');

    filter.catch(error, host);

    expect(superCatch).toHaveBeenCalledWith(error, host);
    expect(res.status).not.toHaveBeenCalled();
  });
});