import { BrowserWindow } from 'electron';
import path from 'path';

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
    // transparent: true,
    // fullscreen: true,
    // skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  if (SETTINGS_WINDOW_VITE_DEV_SERVER_URL) {
    settingsWindow.loadURL(SETTINGS_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    settingsWindow.loadFile(
      path.join(__dirname, `../renderer/${SETTINGS_WINDOW_VITE_NAME}`)
    );
  }

  settingsWindow.on('close', () => {
    settingsWindow = null;
  });

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
