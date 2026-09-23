import { ConfigService } from '@nestjs/config';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.use(helmet);
  app.enableCors({
    origin: configService.get('DOMAIN_ORIGIN'),
    methods: ['GET','POST','PATCH','DELETE'],
    credentials: false
  });


  await app.listen(port);
}
await bootstrap();
