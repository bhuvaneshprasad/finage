import { getDb } from '../dbContext';
import type { AMC } from '../schema';

export async function getAllAmcs(): Promise<Array<AMC>> {
  const db = await getDb();

  const amcs = db.query.amc.findMany();
  return amcs;
}
