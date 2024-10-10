import cors from 'cors';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { rootRouter } from './routes';

export type AppRouter = typeof rootRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: rootRouter,
});

server.listen(8080);
