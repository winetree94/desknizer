import { BrowserWindow } from 'electron';
import { APP_SCHEME } from './protocol';
import SettingsMeta from '@note/settings/package.json';
import { isDevelopment } from './utils';

let settingsWindow: BrowserWindow | null = null;

const open = () => {
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
      `http://localhost:${SettingsMeta.extensionConfigs.devPort}/index.html`
    );
  } else {
    settingsWindow.loadURL(`${APP_SCHEME}://renderers.settings/index.html`);
  }

  settingsWindow.once('ready-to-show', () => settingsWindow?.show());

  return settingsWindow;
};

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
