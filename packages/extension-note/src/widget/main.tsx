import '@mantine/core/styles.css';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NUIMantineProvider } from '@note/ui/providers/Mantine.tsx';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NUIMantineProvider>
      <App />
    </NUIMantineProvider>
  </StrictMode>
);
