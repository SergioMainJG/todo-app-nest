export default () => ({
    PORT: parseInt(Bun.env.PORT!),
    DATABASE_URL: Bun.env.DATABASE_URL,
    JWT_SECRET: Bun.env.JWT_SECRET,
});