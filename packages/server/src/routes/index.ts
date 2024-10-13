import { accountRouter } from './account';
import { publicProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { z } from 'zod';

export const rootRouter = router({
  account: accountRouter,
  extension: router({
    one: publicProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .query(async (opts) => {
        return prisma.extension.findUnique({
          where: {
            id: opts.input.id,
          },
        });
      }),
    list: publicProcedure.query(async () => {
      return prisma.extension.findMany();
    }),
  }),
});
