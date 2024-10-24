import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { IndexPage } from './pages';
import { Suspense } from 'react';
import { NUIMantineProvider } from '@desknizer/ui/providers/Mantine';
import { Webcome } from './pages/welcome.tsx';

const router = createBrowserRouter([
  {
    path: '/:tabValue',
    element: <IndexPage />,
  },
  {
    path: '/',
    element: <Navigate to='extensions' />,
  },
  {
    path: '/welcome',
    element: <Webcome />,
  },
]);

export function SettingsProvider() {
  return (
    <NUIMantineProvider>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </NUIMantineProvider>
  );
}
