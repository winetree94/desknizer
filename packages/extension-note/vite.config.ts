import { createBaseConfigs } from '../extension-base/vite.config';
import Meta from './package.json';

export default {
  ...createBaseConfigs({
    uuid: Meta.extensionConfigs.uuid,
  }),
  server: {
    port: Meta.extensionConfigs.devPort,
  },
};
