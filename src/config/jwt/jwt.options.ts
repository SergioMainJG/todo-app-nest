import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export default {
  imports: [ConfigModule],
  inject: [ConfigService],
  global: true,
  useFactory: (configService: ConfigService) => ({
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.getOrThrow<number>('JWT_EXPIRES_IN'),
      algorithm: 'HS256',
      issuer: 'todo-app-api',
      audience: 'todo-app-web',
    },
    verifyOptions: {
      algorithms: ['HS256'],
      issuer: 'todo-app-api',
      audience: 'todo-app-web',
      ignoreExpiration: false,
    },
  }),
} satisfies JwtModuleAsyncOptions;