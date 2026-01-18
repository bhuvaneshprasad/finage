import path from 'node:path';
import { createEnv } from '@t3-oss/env-core';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = createEnv({
  server: {
    // Database variables
    DB_CONNECTION_NAME: z.string().optional(),
    DB_HOST: z.string(),
    DB_PASSWORD: z.string(),
    DB_USER: z.string(),
    DB_NAME: z.string(),
    DB_PORT: z.number().default(5432),

    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === 'lint',
});
