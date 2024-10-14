import NoteMeta from '@note-extension/note/package.json';
import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDevelopment } from './utils';
import { APP_SCHEME } from './protocol';
import { DatabaseManager } from './database/database';
import {
  UserExtension,
  UserExtensionItem,
} from './database/entities/UserExtension';

export const ExtensionMeta: {
  [key: string]: {
    name: string;
    description: string;
    uuid: string;
    devPort: number;
  };
} = {
  [NoteMeta.extensionConfigs.uuid]: {
    name: NoteMeta.extensionConfigs.name,
    description: NoteMeta.extensionConfigs.description,
    uuid: NoteMeta.extensionConfigs.uuid,
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

/**
 * @description
 * 사용 가능한 익스텐션 목록을 반환
 */
ipcMain.handle('get-extensions', async () => {
  return ExtensionMeta;
});

/**
 * @description
 * 사용자의 익스텐션 설정 정보를 반환
 */
ipcMain.handle(
  'get-user-extension-info',
  async (event, opts: { extensionId: string }) => {
    const manager = DatabaseManager.get().manager;
    const entity = await manager.findOne(UserExtension, {
      where: {
        id: opts.extensionId,
      },
    });
    return entity;
  }
);

/**
 * @description
 * 사용자의 익스텐션 데이터 목록을 반환
 */
ipcMain.handle(
  'get-user-extension-items',
  async (
    event,
    opts: {
      extensionId: string;
    }
  ) => {
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
  }
);

/**
 * @description
 * 사용자의 익스텐션 아이템 데이터를 생성
 */
ipcMain.handle(
  'create-user-extension-item',
  async (
    event,
    opts: {
      extensionId: string;
      data: object;
    }
  ) => {
    const manager = DatabaseManager.get().manager;
    const found = await manager.findOne(UserExtension, {
      where: {
        id: opts.extensionId,
      },
      relations: ['items'],
    });
    if (found) {
      const item = new UserExtensionItem();
      item.data = opts.data;
      item.userExtension = found;
      await manager.save(item);
      return item;
    }
    return null;
  }
);

ipcMain.on(
  'open-extension-settings',
  (event, opts: { extensionId: string }) => {
    ExtensionManager.openExtensionSettings(opts.extensionId);
  }
);

export const ExtensionManager = {
  load: async () => {
    const manager = DatabaseManager.get().manager;
    const extensions = Object.values(ExtensionMeta);
    await manager.transaction(async (manager) => {
      for (const extension of extensions) {
        const found = await manager.findOne(UserExtension, {
          where: {
            id: extension.uuid,
          },
        });
        if (!found) {
          const entity = new UserExtension();
          entity.id = extension.uuid;
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
