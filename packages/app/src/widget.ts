import { BrowserWindow } from 'electron';
import path from 'path';
import { isDevelopment } from './utils';
import { APP_SCHEME } from './protocol';
import { ExtensionMeta } from './extension';
import { handleIpc } from './ipc-main';
import { DatabaseManager } from './database/database';
import {
  UserExtensionItem,
  UserWidget,
} from './database/entities/UserExtension';

export interface OpenExtensionWidgetParams {
  extensionId: string;
  widgetId: string;
}

const openedWidgetWindows = new Map<string, BrowserWindow>();

const createWidgetWindow = (params: OpenExtensionWidgetParams) => {
  if (openedWidgetWindows.has(params.widgetId)) {
    const window = openedWidgetWindows.get(params.widgetId)!;
    window.focus();
    return window;
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  if (isDevelopment) {
    mainWindow.loadURL(
      `http://localhost:${ExtensionMeta[params.extensionId].devPort}/widget.html`
    );
  } else {
    mainWindow.loadURL(`${APP_SCHEME}://${params.extensionId}/widget.html`);
  }

  mainWindow.on('close', async () => {
    openedWidgetWindows.delete(params.widgetId);
  });

  openedWidgetWindows.set(params.widgetId, mainWindow);
};

handleIpc('create-widget', async (event, args) => {
  const manager = DatabaseManager.get().manager;
  const itemEntity = await manager.findOne(UserExtensionItem, {
    where: { id: args.id },
    relations: {
      userExtension: true,
    },
  });
  if (!itemEntity) {
    throw new Error('Entity not found');
  }
  const widgetEntity = manager.create(UserWidget, {
    userExtensionItem: itemEntity,
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  });
  const createdWidgetEntity = await manager.save(widgetEntity);
  return {
    id: createdWidgetEntity.id,
    x: createdWidgetEntity.x,
    y: createdWidgetEntity.y,
    width: createdWidgetEntity.width,
    height: createdWidgetEntity.height,
  };
});

export const WidgetManager = {
  load: async () => {
    const manager = DatabaseManager.get().manager;
    const widgets = await manager.find(UserWidget, {
      relations: {
        userExtensionItem: {
          userExtension: true,
        },
      },
    });
    widgets.forEach((widget) => {
      createWidgetWindow({
        extensionId: widget.userExtensionItem.userExtension.id,
        widgetId: widget.id,
      });
    });
  },
  createWidgetWindow: createWidgetWindow,
  openedWidgetWindows,
};
