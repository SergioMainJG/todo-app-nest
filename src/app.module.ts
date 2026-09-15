import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { type } from 'arktype';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: type({
        PORT: 'string.numeric.parse',
        DATABASE_URL : 'string.url',
        JWT_SECRET: 'string.base64'
      }),
    }),
    UserModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
