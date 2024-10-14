import { MantineProvider } from '@mantine/core';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { IndexPage } from './pages/Index';
import { Suspense } from 'react';

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
  return (
    <MantineProvider>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </MantineProvider>
  );
}
