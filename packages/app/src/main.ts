import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import { uniqueId } from 'lodash';
import path from 'path';
import { trpc } from './trpc';

trpc.account.list.query().then((res) => {
  console.log(res);
});

export interface Extension {
  id: string;
  name: string;
  description: string;
  enable: boolean;
  meta: Record<string, any>;
}

const EXTENSIONS = [
  {
    id: uniqueId('extension-'),
    name: 'Note',
    description: 'A simple note taking extension',
    enable: true,
    meta: {},
  },
  {
    id: uniqueId('extension-'),
    name: 'Todo',
    description: 'A simple todo list extension',
    enable: true,
    meta: {},
  },
];

export interface ExtensionData {
  id: string;
  extensionId: string;
  data: Record<string, any>;
}

const EXTENSION_DATA = [
  {
    id: uniqueId('extension-data-'),
    extensionId: EXTENSIONS[0].id,
    data: {
      content: 'Hello World 1',
    },
  },
  {
    id: uniqueId('extension-data-'),
    extensionId: EXTENSIONS[0].id,
    data: {
      content: 'Hello World 2',
    },
  },
];

const WIDGETS = [
  {
    id: uniqueId('widget-'),
    extensionId: EXTENSIONS[0].id,
    dataId: EXTENSION_DATA[0].id,
    rect: {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
    },
  },
];

let tray: Tray | null = null;

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, './icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      type: 'normal',
      click: () => {
        createSettingsWindow();
      },
    },
    {
      label: 'Item2',
      type: 'normal',
    },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
});

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
      // nodeIntegration: true,
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

ipcMain.handle('get-extensions', (event, args) => {
  return EXTENSIONS;
});

ipcMain.on('open-extension-manager', (event, args) => {});

ipcMain.on('create-widget', (event, args) => {
  if (args.type === 'note') {
    createNoteWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // createMainWindow();
  // createSettingsWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    // createMainWindow();
    // createSettingsWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
