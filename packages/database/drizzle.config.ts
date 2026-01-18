import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

// Determine if we are running locally or in production
const isProd = env.NODE_ENV === 'production';

// If host is a socket path (starts with "/") → UDS, no SSL
const isUDS = env.DB_HOST?.startsWith('/');

// Configure SSL dynamically
const ssl =
  isProd && !isUDS
    ? { rejectUnauthorized: true } // enforce TLS in production over TCP
    : false; // local dev or UDS → no TLS

export default defineConfig({
  out: './migrations',
  schema: './src/schema/*',
  dialect: 'postgresql',
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT || 5432,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl,
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
});
