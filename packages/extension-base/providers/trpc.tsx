import type { AppRouter } from '@note/server/src';
import { createTRPCReact } from '@trpc/react-query';
import { PropsWithChildren, useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';

export const trpc = createTRPCReact<AppRouter>();

export function ExtensionTRPCProvider(props: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:8080',
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      {props.children}
    </trpc.Provider>
  );
}
