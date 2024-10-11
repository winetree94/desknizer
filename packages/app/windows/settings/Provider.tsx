import { MantineProvider } from '@mantine/core';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { IndexPage } from './pages/Index';
import { useState } from 'react';
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';

const router = createBrowserRouter([
  {
    path: '/:tabValue',
    element: <IndexPage />,
  },
  {
    path: '/',
    element: <Navigate to='extensions' />,
  },
]);

export function SettingsProvider() {
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
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </trpc.Provider>
  );
}
