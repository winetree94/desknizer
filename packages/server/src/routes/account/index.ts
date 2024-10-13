import { prisma } from '../../prisma';
import { publicProcedure, router } from '../../trpc';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const accountRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20),
      })
    )
    .query(async (opts) => {
      prisma.user.create({
        data: {
          email: opts.input.email,
          password: bcrypt.hashSync(opts.input.password, 10),
        },
      });
    }),
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20),
      })
    )
    .query(async (opts) => {
      const user = await prisma.user.findUnique({
        where: {
          email: opts.input.email,
        },
      });
      console.log(user);
    }),
  list: publicProcedure.query(async () => {
    const users = await prisma.user.findMany();
    return users;
  }),
});
