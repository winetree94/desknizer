import { prisma } from '../../prisma';
import { publicProcedure, router } from '../../trpc';

export const accountRouter = router({
  list: publicProcedure.query(async () => {
    const users = await prisma.user.findMany();
    return users;
  }),
});
