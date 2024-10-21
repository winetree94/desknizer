import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { IndexPage } from './pages/Index';
import { Suspense } from 'react';
import { NUIMantineProvider } from '@note/ui/providers/Mantine';

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
    <NUIMantineProvider>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </NUIMantineProvider>
  );
}
