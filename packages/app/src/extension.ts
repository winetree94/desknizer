import NoteMeta from '@note-extension/note/package.json';
import { BrowserWindow } from 'electron';
import path from 'path';
import { isDevelopment } from './utils';
import { APP_SCHEME } from './protocol';

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

  openedExtensionSettings[extensionId] = openedWindow;
};

const openExtensionWidget = (extensionId: string) => {
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
      `http://localhost:${ExtensionMeta[extensionId].devPort}/widget.html`
    );
  } else {
    mainWindow.loadURL(`${APP_SCHEME}://${extensionId}/widget.html`);
  }
};

export const ExtensionManager = {
  openExtensionSettings: openExtensionSettings,
  openExtensionWidget: openExtensionWidget,
};
