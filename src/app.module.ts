import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type } from 'arktype';
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import configuration from './config/configuration.js';
import { AuthModule } from './auth/auth.module.js';
import { TodosModule } from './todos/todos.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: type({
        PORT: 'string.numeric.parse',
        DATABASE_URL : 'string.url',
        JWT_SECRET: 'string.base64',
        JWT_EXPIRES_IN: 'string.numeric.parse',
        HASH_MEMORY_COST: 'string.numeric.parse',
        HASH_TIME_COST: 'string.numeric.parse',
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: ( configService: ConfigService ) => ({
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
        }

      }),
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
