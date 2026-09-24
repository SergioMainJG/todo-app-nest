import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import configOptions from './config/envs/config.options.js';
import jwtOptions from './config/jwt/jwt.options.js';
import throttlersOptions from './config/throttler/throttlers.options.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TodosModule } from './todos/todos.module.js';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    JwtModule.registerAsync(jwtOptions),
    ThrottlerModule.forRoot(throttlersOptions),
    UserModule,
    PrismaModule,
    AuthModule,
    TodosModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_PIPE,
    useClass: StandardSchemaValidationPipe
  }],
})
export class AppModule {}
