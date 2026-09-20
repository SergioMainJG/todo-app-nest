export default () => ({
    PORT: parseInt(Bun.env.PORT!),
    DATABASE_URL: Bun.env.DATABASE_URL,
    JWT_SECRET: Bun.env.JWT_SECRET,
    JWT_EXPIRES_IN: parseInt(Bun.env.JWT_EXPIRES_IN!),
    HASH_MEMORY_COST: parseInt(Bun.env.HASH_MEMORY_COST!),
    HASH_TIME_COST: parseInt(Bun.env.HASH_TIME_COST!),
});