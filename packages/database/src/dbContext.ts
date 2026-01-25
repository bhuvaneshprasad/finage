import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { createPool } from './pool';
import * as databaseSchema from './schema';

type Database = NodePgDatabase<typeof databaseSchema>;

let dbInstance: Database | null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }
  const pool = await createPool();
  dbInstance = drizzle(pool, {
    schema: databaseSchema,
    casing: 'snake_case',
  }) as Database;
  return dbInstance;
}
