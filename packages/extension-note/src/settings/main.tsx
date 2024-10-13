import '@mantine/core/styles.css';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExtensionTRPCProvider } from '@note-extension/base/providers/trpc.tsx';
import { ExtensionMantineProvider } from '@note-extension/base/providers/mantine.tsx';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExtensionTRPCProvider>
      <ExtensionMantineProvider>
        <App />
      </ExtensionMantineProvider>
    </ExtensionTRPCProvider>
  </StrictMode>
);
