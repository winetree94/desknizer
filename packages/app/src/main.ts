import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import './tray';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;
declare const SETTINGS_WINDOW_VITE_DEV_SERVER_URL: string;
declare const SETTINGS_WINDOW_VITE_NAME: string;
declare const NOTE_WINDOW_VITE_DEV_SERVER_URL: string;
declare const NOTE_WINDOW_VITE_NAME: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createMainWindow = () => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    // transparent: true,
    // fullscreen: true,
    // skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // mainWindow.setIgnoreMouseEvents(true);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const createNoteWindow = () => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // mainWindow.setIgnoreMouseEvents(true);

  // and load the index.html of the app.
  if (NOTE_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(NOTE_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${NOTE_WINDOW_VITE_NAME}`)
    );
  }
};

const createSettingsWindow = () => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    // frame: false,
    // transparent: true,
    // fullscreen: true,
    // skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // mainWindow.setIgnoreMouseEvents(true);

  // and load the index.html of the app.
  if (SETTINGS_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(SETTINGS_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${SETTINGS_WINDOW_VITE_NAME}`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.on('create-widget', (event, args) => {
  if (args.type === 'note') {
    createNoteWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMainWindow();
  // createSettingsWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
    // createSettingsWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
