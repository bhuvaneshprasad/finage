import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(__dirname, '../../.env') });

// Determine if we are running locally or in production
const isProd = process.env.NODE_ENV === 'production';

// If host is a socket path (starts with "/") → UDS, no SSL
const isUDS = process.env.DB_HOST?.startsWith('/');

// Configure SSL dynamically
const ssl = isProd && !isUDS ? { rejectUnauthorized: true } : false;

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}


export default defineConfig({
  out: './migrations',
  schema: './src/schema/*',
  dialect: 'postgresql',
  dbCredentials: {
    host: required('DB_HOST'),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
    port: Number(process.env.DB_PORT) || 5432,
    ssl,
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
});
