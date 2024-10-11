import { accountRouter } from './account';
import { publicProcedure, router } from '../trpc';
import { prisma } from '../prisma';

export const rootRouter = router({
  account: accountRouter,
  extension: router({
    list: publicProcedure.query(async () => {
      return prisma.extension.findMany();
    }),
  }),
});
