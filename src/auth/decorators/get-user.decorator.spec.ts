import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { getUser } from './get-user.decorator';
import type { AuthPayload } from '../../types/auth-payload';

const user: AuthPayload = {
  id: 1,
  fullName: 'Sergio',
  email: 'sergio@example.com',
  iat: 123456,
  exp: 123456,
  aud: 'api',
  iss: 'auth',
};

const mockContext = (reqUser?: AuthPayload) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user: reqUser }),
    }),
  }) as unknown as ExecutionContext;

describe('GetUser decorator test suite', () => {
  it('returns the full user when no property is specified', () => {
    expect(getUser(undefined, mockContext(user))).toEqual(user);
  });

  it('returns only the requested property', () => {
    expect(getUser('email', mockContext(user))).toBe('sergio@example.com');
  });

  it('throws when the request has no user', () => {
    expect(() => getUser(undefined, mockContext())).toThrow(InternalServerErrorException);
  });
});