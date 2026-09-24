import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtOptions from './jwt.options';

describe('jwt.options', () => {
  it('verifies the tokens it signs', async () => {
    const config = new ConfigService({ JWT_SECRET: 'Y2ktc2VjcmV0', JWT_EXPIRES_IN: 3600 });
    const jwt = new JwtService(jwtOptions.useFactory(config));

    const token = await jwt.signAsync({ id: 1 });

    await expect(jwt.verifyAsync(token)).resolves.toMatchObject({ id: 1 });
  });
});