import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDevelopment } from './utils';
import { APP_SCHEME } from './protocol';
import { ExtensionMeta } from './extension';

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

ipcMain.on('create-widget', (event, args) => {
  WidgetManager.openExtensionWidget(args.extensionId);
});

export const WidgetManager = {
  load: async () => {},
  openExtensionWidget: openExtensionWidget,
};
