import '@mantine/core/styles.css';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsProvider } from './Provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider />
  </StrictMode>
);
