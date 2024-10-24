import { app, BrowserWindow } from 'electron';
import { APP_SCHEME } from './protocol';
import SettingsMeta from '@desknizer/settings/package.json';
import { isDevelopment } from './utils';
import { handleIpc, onIpc } from './ipc-main';

let settingsWindow: BrowserWindow | null = null;

export interface OpenSettingsWindowOptions {
  path?: string;
}

const open = (options: OpenSettingsWindowOptions) => {
  // Create the browser window.

  if (settingsWindow) {
    settingsWindow.focus();
    return settingsWindow;
  }

  settingsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    show: false,
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  });

  if (isDevelopment) {
    settingsWindow.loadURL(
      `http://localhost:${SettingsMeta.extensionConfigs.devPort}${options.path || ''}`
    );
  } else {
    settingsWindow.loadURL(
      `${APP_SCHEME}://renderers.settings${options.path || ''}`
    );
  }

  settingsWindow.once('ready-to-show', () => settingsWindow?.show());

  return settingsWindow;
};

handleIpc('get-is-login-item', async () => {
  return { isLoginItem: app.getLoginItemSettings().openAtLogin };
});

onIpc('set-is-login-item', async (event, args) => {
  app.setLoginItemSettings({
    openAtLogin: args.isLoginItem,
  });
});

const close = () => {
  settingsWindow?.close();
};

const getWindow = () => settingsWindow;

export const SettingsWindowManager = {
  load: async () => {},
  getWindow: getWindow,
  open: open,
  close: close,
};
