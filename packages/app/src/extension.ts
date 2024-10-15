import NoteMeta from '@note-extension/note/package.json';
import { BrowserWindow } from 'electron';
import path from 'path';
import { isDevelopment } from './utils';
import { APP_SCHEME } from './protocol';
import { DatabaseManager } from './database/database';
import {
  UserExtension,
  UserExtensionItem,
} from './database/entities/UserExtension';
import { handleIpc } from './ipc-main';

export const ExtensionMeta: {
  [key: string]: {
    id: string;
    name: string;
    description: string;
    devPort: number;
  };
} = {
  [NoteMeta.extensionConfigs.uuid]: {
    id: NoteMeta.extensionConfigs.uuid,
    name: NoteMeta.extensionConfigs.name,
    description: NoteMeta.extensionConfigs.description,
    devPort: NoteMeta.extensionConfigs.devPort,
  },
} as const;

const openedExtensionSettings: {
  [key: string]: BrowserWindow;
} = {};

const openExtensionSettings = (extensionId: string) => {
  const openedWindow = openedExtensionSettings[extensionId];
  if (openedWindow) {
    openedWindow.focus();
    return openedWindow;
  }

  // Create the browser window.
  const window = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  if (isDevelopment) {
    window.loadURL(
      `http://localhost:${ExtensionMeta[extensionId].devPort}/index.html`
    );
  } else {
    window.loadURL(`${APP_SCHEME}://${extensionId}/index.html`);
  }

  window.on('close', () => {
    delete openedExtensionSettings[extensionId];
  });

  openedExtensionSettings[extensionId] = window;
};

handleIpc('get-extensions', () => {
  return Object.values(ExtensionMeta).map((extension) => ({
    ...extension,
    meta: {},
  }));
});

handleIpc('get-user-extension-info', async (event, opts) => {
  const manager = DatabaseManager.get().manager;
  const entity = await manager.findOne(UserExtension, {
    where: {
      id: opts.extensionId,
    },
  });
  if (!entity) {
    throw new Error('Extension not found');
  }
  return entity;
});

handleIpc('get-user-extension-items', async (event, opts) => {
  const manager = DatabaseManager.get().manager;
  const found = await manager.findOne(UserExtension, {
    where: {
      id: opts.extensionId,
    },
    relations: ['items'],
  });
  if (found) {
    return found.items;
  }
  return [];
});

handleIpc('create-user-extension-item', async (event, opts) => {
  const manager = DatabaseManager.get().manager;
  const found = await manager.findOne(UserExtension, {
    where: {
      id: opts.extensionId,
    },
    relations: ['items'],
  });
  if (!found) {
    throw new Error('Extension not found');
  }
  const item = new UserExtensionItem<object, object>();
  item.data = opts.data as object;
  item.userExtension = found;
  await manager.save(item);
  return item;
});

handleIpc('open-extension-settings', (event, opts: { extensionId: string }) => {
  ExtensionManager.openExtensionSettings(opts.extensionId);
});

export const ExtensionManager = {
  load: async () => {
    const manager = DatabaseManager.get().manager;
    const extensions = Object.values(ExtensionMeta);
    await manager.transaction(async (manager) => {
      for (const extension of extensions) {
        const found = await manager.findOne(UserExtension, {
          where: {
            id: extension.id,
          },
        });
        if (!found) {
          const entity = new UserExtension();
          entity.id = extension.id;
          entity.meta = {};
          await manager.save(entity);
        }
      }
    });
  },
  openedExtensionSettings: openedExtensionSettings,
  openExtensionSettings: openExtensionSettings,
  getOpenedExtensionWindow: (extensionId: string) => {
    console.log(openedExtensionSettings);
    return openedExtensionSettings[extensionId];
  },
};
