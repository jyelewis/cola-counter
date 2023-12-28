import { z } from 'zod';

export const Fridge = z.object({
  name: z.string(),
  numStockedCans: z.number(),
});

export type Fridge = z.infer<typeof Fridge>;
