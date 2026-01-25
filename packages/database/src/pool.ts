import { Pool } from 'pg';
import { env } from './env';

const isProd = env.NODE_ENV === 'production';

export async function createPool(): Promise<Pool> {
  if (isProd) {
    if (!env.DB_CONNECTION_NAME) {
      throw new Error('DB_CONNECTION_NAME is required');
    }

    return new Pool({
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      max: 5,
    });
  }

  if (!env.DB_HOST) {
    throw new Error('DB_HOST is required for dev');
  }

  return new Pool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT,
    max: 5,
  });
}
