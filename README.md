<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A Todo app with user authentication made with NestJS (all the rigths ).</p>
## Description

A simple todo app made it in: [Nest](https://github.com/nestjs/nest) and [Postgres](www.postgresql.org).
The project use Bun as Runtime with pods (using podman) as containerization technology.


## Project setup

1.- Do the next commands in your terminal to install the project in your system
```bash
$ git clone https://github.com/SergioMainJG/todo-app-nest.git ##OR
$ git clone git@github.com:SergioMainJG/todo-app-nest.git ## OR use gh cli app
$ bun install ## To install dependencies
$ bun run update:quadlet ## to move quadlets into systemd for your user, rootless. Or use the next
```

2.- Once done, copy and rename the file `template.env` into `.env`. Make sure the `.env` file is in `.gitignore` for security purposes.

3.- Manage secrets of your application with `podman secrets`. You can use the next commands if you plan to use `.env` as the provider of your secrets
```bash
set -a && source ./secrets.env && set +a

podman secret create todo-app-db-pass          <(printf '%s' "$POSTGRES_PASSWORD")
podman secret create todo-app-db-url           <(printf '%s' "$DB_URL")
podman secret create todo-app-jwt-secret       <(printf '%s' "$JWT_SECRET")
podman secret create todo-app-jwt-expires-in   <(printf '%s' "$JWT_EXPIRES_IN")
podman secret create todo-app-port             <(printf '%s' "$PORT")
podman secret create todo-app-hash-memory-cost <(printf '%s' "$HASH_MEMORY_COST")
podman secret create todo-app-hash-time-cost   <(printf '%s' "$HASH_TIME_COST")
```
Get sure your secrets are correctly called from our kubes in `/deploy`.
Each change in your secrets or when you start the project for your first time, use the next commands after all the previous set up:
```bash
$ systemctl --user daemon-reload ##This will reload your services about your user
$ systemctl --user start todo-app-postgres.service ##This will start the database
$ systemctl --user restart todo-app-postgres.service ##Just in case if the service was set up before and want to update something
``` 

**Optional**:
You can use `journalctl -f --user -u todo-app-postgres.service` or `journalctl --user -fxeu todo-app-postgres.service` to see the logs of your container.


4.- Set up prisma with:
```bash
$ bunx prisma generate
$ bunx prisma migrate dev
$ bunx prisma ## Just in case you needs other commands, otherwise this command won't do anything
```

## Development

The architecture follows the NestJS principles. Basically clean architecture with scream architecture.
Each validation is using arktype schema into the `StandardSchemaValidationPipe`, this is instead `class-validator` and `class-transformer`, Arktype do the work of those libraries. 
Prisma makes easy the manage along development and offering a good DX, then each change in our model is in `prisma.schema`. Unlike Drizzle or Mikroorm, we're using a `PrismaService` over the repository pattern, making this easy to mantein it from the `prisma.schema`.

For the day to day workflow you have the next scripts available (run them with `bun run <script>`):

```bash
$ start:dev    # Run the app with hot-reload using Bun as runtime
$ start:debug  # Run the app with --inspect and hot-reload, for attaching a debugger
$ start:prod   # Run the already built app (dist/main.js) with Node
$ build        # Compile the project with the Nest CLI
$ lint         # Lint src/ and test/ with oxlint
$ format       # Format src/ and test/ with prettier
$ test         # Run unit tests with vitest
$ test:watch   # Run unit tests in watch mode
$ test:cov     # Run unit tests with coverage
$ test:e2e     # Run e2e tests (vitest.config.e2e.ts)
```

Environment variables are validated on boot through an arktype schema declared in `src/app.module.ts`, so the app refuses to start if any of them is missing or malformed. The variables consumed by `src/config/configuration.ts` are:

| Variable            | Description                                              |
| ------------------- | ---------------------------------------------------------- |
| `PORT`              | Port the HTTP server listens on                          |
| `DATABASE_URL`      | Postgres connection string used by Prisma                |
| `JWT_SECRET`        | Base64 secret (48+ chars) used to sign/verify JWTs       |
| `JWT_EXPIRES_IN`    | JWT expiration time, in seconds                          |
| `HASH_MEMORY_COST`  | Argon2 memory cost used to hash passwords                |
| `HASH_TIME_COST`    | Argon2 time cost used to hash passwords                  |
| `DOMAIN_ORIGIN`     | Allowed origin for CORS                                  |

## Security

- Passwords are hashed with **Argon2** (`src/auth/helpers/argon2.hashing.ts`), tuned through `HASH_MEMORY_COST`/`HASH_TIME_COST`.
- Password strength is enforced at registration time with `@zxcvbn-ts`, rejecting easily guessable passwords (`src/lib/password-strength.ts`).
- Authentication is stateless via **JWT** (`@nestjs/jwt`), issued on register/login and required by the `AuthGuard` on protected routes (`user`, `todos`).
- `helmet` sets secure HTTP headers, and CORS is restricted to `DOMAIN_ORIGIN`.
- `@nestjs/throttler` rate-limits requests with three tiers (short/medium/long) to mitigate brute-force and abuse.
- Every input (body, query, params) is parsed and validated with **Arktype** schemas through `StandardSchemaValidationPipe` before reaching a controller.
- Database access goes exclusively through `PrismaService`, and Prisma errors are normalized by `PrismaExceptionsFilter` so internals are never leaked to clients.

## API

All routes are prefixed with nothing extra (no global prefix). `todos` and `user` routes require an `Authorization: Bearer <token>` header, obtained from `auth/register` or `auth/login`.

### Auth (`/auth`)

| Method | Route             | Body                          | Description                                  |
| ------ | ------------------ | ------------------------------ | --------------------------------------------- |
| POST   | `/auth/register`  | `fullName`, `email`, `password` | Creates a user and returns it with a JWT      |
| POST   | `/auth/login`     | `email`, `password`             | Validates credentials and returns a JWT       |

### User (`/user`) — requires auth

| Method | Route   | Query                          | Description                                  |
| ------ | -------- | -------------------------------- | --------------------------------------------- |
| GET    | `/user` | `credential` (email or fullName) | Returns a user (with its todos) by email or full name |

### Todos (`/todos`) — requires auth

| Method | Route         | Body / Params                              | Description                    |
| ------ | -------------- | -------------------------------------------- | -------------------------------- |
| GET    | `/todos/:id`  | -                                            | Get a todo by id (own todos only) |
| POST   | `/todos`      | `title`, `description`, `status?`            | Create a todo                    |
| PATCH  | `/todos/:id`  | `title?`, `description?`, `status?`          | Update a todo                    |
| DELETE | `/todos/:id`  | -                                            | Delete a todo                    |

A `Todos.status` can be one of `INACTIVE`, `IN_PROGRESS`, `CANCELED`, `DONE`.

## Testing

```bash
$ bun run test       # unit tests (vitest)
$ bun run test:cov   # unit tests with coverage
$ bun run test:e2e   # end-to-end tests against a running app
```

## Tech stack

- Runtime: [Bun](https://bun.sh)
- Framework: [NestJS](https://nestjs.com) 12 over Express
- Database: PostgreSQL, accessed through [Prisma](https://www.prisma.io) 7 with the `pg` adapter
- Validation: [Arktype](https://arktype.io) (schemas + `StandardSchemaValidationPipe`)
- Auth: `@nestjs/jwt` + Argon2 password hashing + `@zxcvbn-ts` strength checks
- Containerization: Podman, driven by Quadlet unit files in `/deploy` (`.container`, `.network`, `.volume`)
- Lint/format: oxlint + Prettier
- Tests: Vitest (unit and e2e)

## License

This project is licensed under the [MIT License](./LICENCE.md).