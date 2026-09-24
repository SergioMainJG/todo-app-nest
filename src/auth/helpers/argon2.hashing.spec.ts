import { Argon2Hashing } from './argon2.hashing';

const password = 'Tr0ub4dor&3xyz!';

describe('Argon2Hashing', () => {
  beforeEach(() => {
    vi.stubEnv('HASH_MEMORY_COST', '4096');
    vi.stubEnv('HASH_TIME_COST', '2');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('produces an argon2id hash with the configured costs', async () => {
    const hash = await Argon2Hashing.hashPassword(password);

    expect(hash).toMatch(/^\$argon2id\$v=19\$m=4096,t=2,p=\d+\$/);
  });

  it('uses a random salt for the same password', async () => {
    const [first, second] = await Promise.all([
      Argon2Hashing.hashPassword(password),
      Argon2Hashing.hashPassword(password),
    ]);

    expect(first).not.toBe(second);
  });

  it('verifies the original password', async () => {
    const hash = await Argon2Hashing.hashPassword(password);

    await expect(Argon2Hashing.verifyPassword(password, hash)).resolves.toBe(true);
  });

  it('rejects a different password', async () => {
    const hash = await Argon2Hashing.hashPassword(password);

    await expect(Argon2Hashing.verifyPassword('otra-cosa', hash)).resolves.toBe(false);
  });

  it('fails when the cost config is missing', async () => {
    vi.stubEnv('HASH_MEMORY_COST', undefined);

    await expect(Argon2Hashing.hashPassword(password)).rejects.toThrow();
  });
});