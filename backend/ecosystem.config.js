require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/main.js',
      autorestart: true,
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT,
        POSTGRES_HOST: process.env.POSTGRES_HOST,
        POSTGRES_PORT: process.env.POSTGRES_PORT,
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
        POSTGRES_DB: process.env.POSTGRES_DB,
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      },
    },
  ],
};
