import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  protocol,
  net,
} from 'electron';
import { pathToFileURL } from 'url';
import path from 'path';
import { trpc } from './trpc';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      bypassCSP: true,
      supportFetchAPI: true,
      secure: true,
      standard: true,
      stream: true,
      codeCache: true,
      corsEnabled: true,
      allowServiceWorkers: true,
    },
  },
]);

trpc.account.list.query().then((res) => {
  console.log(res);
});

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

  protocol.handle('app', (req) => {
    const { host, pathname } = new URL(req.url);
    console.log('host: ', host);
    console.log('pathname: ', pathname);

    // NB, this checks for paths that escape the bundle, e.g.
    // app://bundle/../../secret_file.txt

    if (pathname === '/') {
      const indexPath = path.resolve(__dirname, host, 'index.html');
      console.log(indexPath);
      return net.fetch(pathToFileURL(indexPath).toString());
    }

    const pathToServe = path.resolve(__dirname, host, pathname.slice(1));
    return net.fetch(pathToFileURL(pathToServe).toString());
  });
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createExtensionSettings = (extensionId: string) => {
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

  mainWindow.loadURL(`app://${extensionId}`);

  mainWindow.webContents.openDevTools({
    mode: 'detach',
  });
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

ipcMain.on(
  'open-extension-settings',
  (event, args: { extensionId: string }) => {
    console.log(args);
    createExtensionSettings(args.extensionId);
  }
);

ipcMain.on('create-widget', (event, args) => {
  if (args.type === 'note') {
    createExtensionSettings('1');
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // createMainWindow();
  // createSettingsWindow();
  createSettingsWindow();
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
