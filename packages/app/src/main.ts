import 'reflect-metadata';
import './context-menu';
import './windows';
import { app, BrowserWindow, globalShortcut } from 'electron';
import { SettingsWindowManager } from './settings';
import { ProtocolManager } from './protocol';
import { TrayManager } from './tray';
import { DatabaseManager } from './database/database';
import { ExtensionManager } from './extension';
import { WidgetManager } from './widget';
import { Config } from './database/entities/UserExtension';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.whenReady().then(async () => {
  const showKeyRegistration = globalShortcut.register(
    'CommandOrControl+Alt+Shift+X',
    async () => {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.setSkipTaskbar(true);
        window.hide();
      });
      windows.forEach((window) => {
        window.show();
      });
      windows.forEach((window) => {
        window.setSkipTaskbar(false);
        window.focus();
      });
    }
  );
  if (!showKeyRegistration) {
    console.error('registration failed');
  }

  const hideKeyRegistration = globalShortcut.register(
    'CommandOrControl+Alt+Shift+C',
    async () => {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.hide();
        window.setSkipTaskbar(false);
        // window.show();
        // window.setAlwaysOnTop(false);
      });
    }
  );
  if (!hideKeyRegistration) {
    console.error('registration failed');
  }

  await Promise.all([
    DatabaseManager.load().then(() =>
      Promise.all([ExtensionManager.load(), WidgetManager.load()])
    ),
    TrayManager.load(),
    SettingsWindowManager.load(),
    ProtocolManager.load(),
  ]);

  const manager = DatabaseManager.get().manager;
  const configs = await manager.findOne<
    Config<{
      firstLaunch: boolean;
    }>
  >(Config, {
    where: {
      key: 'configs',
    },
  });
  if (!configs || !configs.value.firstLaunch) {
    await manager.insert(Config, {
      key: 'configs',
      value: {
        firstLaunch: true,
      },
    });
    SettingsWindowManager.open();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', () => {
// createMainWindow();
// createSettingsWindow();
// SettingsWindowManager.open();
// });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// prevent auto quitting
app.on('window-all-closed', () => {});

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     // createMainWindow();
//     // createSettingsWindow();
//   }
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
