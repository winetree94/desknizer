import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import './index.css';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { NUIMantineProvider } from '@desknizer/ui/providers/Mantine.tsx';
import { App } from './App.tsx';
import { WidgetProvider } from '@desknizer/ui/providers/WidgetProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NUIMantineProvider>
      <Suspense fallback={<>loading</>}>
        <WidgetProvider>
          <App />
        </WidgetProvider>
      </Suspense>
    </NUIMantineProvider>
  </StrictMode>
);
