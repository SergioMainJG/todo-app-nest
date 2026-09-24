import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { setupApp } from '../src/main.setup.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('User (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);
  });

  beforeEach(async () => {
    await prisma.todos.deleteMany();
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  const createUser = async (fullName: string, email: string) => {
    const user = await prisma.users.create({
      data: { fullName, email, password_hash: 'not-used-in-this-suite' },
    });
    const token = await jwt.signAsync({ id: user.id, fullName: user.fullName, email: user.email });

    return { user, token };
  };

  it('rejects requests without a token', () => {
    return request(app.getHttpServer())
      .get('/user')
      .query({ credential: 'sergio@example.com' })
      .expect(401);
  });

  it('rejects an invalid credential', async () => {
    const { token } = await createUser('Sergio Arturo', 'sergio@example.com');

    await request(app.getHttpServer())
      .get('/user')
      .query({ credential: 'no valido' })
      .auth(token, { type: 'bearer' })
      .expect(400);
  });

  it('returns the user without password_hash', async () => {
    const { user, token } = await createUser('Sergio Arturo', 'sergio@example.com');

    const res = await request(app.getHttpServer())
      .get('/user')
      .query({ credential: user.email })
      .auth(token, { type: 'bearer' })
      .expect(200);

    expect(res.body).toEqual({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      todos: [],
    });
  });

  it('returns 404 for a user that does not exist', async () => {
    const { token } = await createUser('Sergio Arturo', 'sergio@example.com');

    await request(app.getHttpServer())
      .get('/user')
      .query({ credential: 'nadie@example.com' })
      .auth(token, { type: 'bearer' })
      .expect(404);
  });

  it.todo('decide whether a user can look up another user and their todo');
});