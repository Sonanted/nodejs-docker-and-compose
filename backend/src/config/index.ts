export default () => ({
  port: process.env.PORT || 8000,
  database: {
    host: process.env.POSTGRES_HOST || 'database',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    database: process.env.POSTGRES_DB || 'kupipodariday',
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || 'super_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  hash: {
    saltRounds: process.env.HASH_SALT_ROUNDS || 10,
  },
});
