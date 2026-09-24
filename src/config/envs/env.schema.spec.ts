import { type } from 'arktype';
import { envSchema } from './env.schema';

const env = {
  PORT: '3000',
  DATABASE_URL: 'postgresql://ci:ci@localhost:5432/todo',
  JWT_SECRET: 'Y2ktc2VjcmV0',
  JWT_EXPIRES_IN: '3600',
  HASH_MEMORY_COST: '4096',
  HASH_TIME_COST: '2',
  DOMAIN_ORIGIN: 'http://localhost:4200',
};

describe('envSchema', () => {
  it('parses numeric vars into numbers', () => {
    expect(envSchema(env)).toMatchObject({ PORT: 3000, JWT_EXPIRES_IN: 3600 });
  });

  it.each(['JWT_SECRET', 'DATABASE_URL', 'DOMAIN_ORIGIN'])('requires %s', (key) => {
    const { [key]: _, ...rest } = env as Record<string, string>;
    expect(envSchema(rest)).toBeInstanceOf(type.errors);
  });

  it('rejects a non-base64 JWT_SECRET', () => {
    expect(envSchema({ ...env, JWT_SECRET: 'HolaMundo' })).toBeInstanceOf(type.errors);
  });
});