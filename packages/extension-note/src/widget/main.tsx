import '@mantine/core/styles.css';
import './index.css';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { NUIMantineProvider } from '@note/ui/providers/Mantine.tsx';
import { App } from './App.tsx';
import { WidgetProvider } from '@note/ui/providers/WidgetProvider.tsx';

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
