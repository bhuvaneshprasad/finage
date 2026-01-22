import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const benchmark = pgTable('benchmark', {
  benchmarkCode: integer('benchmark_code').primaryKey().generatedByDefaultAsIdentity(),
  benchmarkName: text('benchmark_name').notNull().unique(),
});

export type Benchmark = typeof benchmark.$inferSelect;
export type NewBenchmark = typeof benchmark.$inferInsert;
