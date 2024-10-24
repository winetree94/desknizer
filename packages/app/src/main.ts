import 'reflect-metadata';
import './context-menu';
import './windows';
import { app, globalShortcut } from 'electron';
import { SettingsWindowManager } from './settings';
import { ProtocolManager } from './protocol';
import { TrayManager } from './tray';
import { DatabaseManager } from './database/database';
import { ExtensionManager } from './extension';
import { WidgetManager } from './widget';
import { Config } from './database/entities/UserExtension';
import { loadShortcuts } from './shortcuts';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.whenReady().then(async () => {
  await loadShortcuts();
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
    await manager.upsert(
      Config,
      {
        key: 'configs',
        value: {
          firstLaunch: true,
        },
      },
      ['key']
    );
    SettingsWindowManager.open({
      path: '/welcome',
    });
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// prevent auto quitting
app.on('window-all-closed', () => {});
