import '@mantine/core/styles.css';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NUIMantineProvider } from '@desknizer/ui/providers/Mantine.tsx';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NUIMantineProvider>
      <App />
    </NUIMantineProvider>
  </StrictMode>
);
