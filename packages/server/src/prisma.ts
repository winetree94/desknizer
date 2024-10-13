import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

export const prisma = new PrismaClient().$extends({
  query: {
    user: {
      $allOperations({ operation, args, query }) {
        console.log(operation, args, query);
        // if (['create', 'update'].includes(operation) && args.data['password']) {
        //   args.data['password'] = bcrypt.hashSync(args.data['password'], 10);
        // }
        return query(args);
      },
    },
  },
});
