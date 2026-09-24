import { INestApplication, StandardSchemaValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";

export const setupApp = async (app: INestApplication) => {
    const configService = app.get(ConfigService);

    const port = configService.get('PORT');

    app.useGlobalPipes(new StandardSchemaValidationPipe());
    app.use(helmet());
    app.enableCors({
        origin: configService.get('DOMAIN_ORIGIN'),
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: false
    });
    app.enableShutdownHooks();

    await app.listen(port);
}