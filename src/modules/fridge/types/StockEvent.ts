import { z } from 'zod';

export const StockEvent = z.object({
  fridgeName: z.string(),
  date: z.string().datetime(),
  numCansAdded: z.number(),
});

export type StockEvent = z.infer<typeof StockEvent>;
