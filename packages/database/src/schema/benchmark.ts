import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const benchmark = pgTable('benchmark', {
  benchmarkCode: integer('benchmark_code').primaryKey(),
  benchmarkName: text('benchmark_name').notNull(),
});

export type Benchmark = typeof benchmark.$inferSelect;
export type NewBenchmark = typeof benchmark.$inferInsert;
