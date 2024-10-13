import NoteMeta from '@note-extension/note/package.json';

export const ExtensionMeta: {
  [key: string]: {
    uuid: string;
    devPort: number;
  };
} = {
  [NoteMeta.extensionConfigs.uuid]: {
    uuid: NoteMeta.extensionConfigs.uuid,
    devPort: NoteMeta.extensionConfigs.devPort,
  },
} as const;
