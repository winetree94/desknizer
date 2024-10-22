import Meta from './package.json';
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  build: {
    outDir: `../app/public/renderers/settings`,
  },
  server: {
    port: Meta.extensionConfigs.devPort,
  },
};
