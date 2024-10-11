import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@note/server/src';

export const trpc = createTRPCReact<AppRouter>();
