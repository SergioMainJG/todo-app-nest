import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupApp } from "./main.setup";

const app = await NestFactory.create(AppModule);
await setupApp(app);