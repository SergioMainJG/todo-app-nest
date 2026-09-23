import { type } from "arktype";
import configuration from "./configuration";

export default {
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: type({
        PORT: 'string.numeric.parse',
        DATABASE_URL : 'string.url',
        JWT_SECRET: 'string.base64 > 48',
        JWT_EXPIRES_IN: 'string.numeric.parse',
        HASH_MEMORY_COST: 'string.numeric.parse',
        HASH_TIME_COST: 'string.numeric.parse',
        DOMAIN_ORIGIN: 'string',
      }),
}