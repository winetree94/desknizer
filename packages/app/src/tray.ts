import { app, Menu, Tray } from 'electron';
import path from 'path';
import { SettingsWindowManager } from './settings';
import { ExtensionManager, ExtensionMeta } from './extension';
import { getPublicPath } from './utils';

let tray: Tray | null = null;

const load = async () => {
  if (tray) {
    return tray;
  }
  await app.whenReady();
  tray = new Tray(path.join(getPublicPath(), './icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      type: 'normal',
      click: () => {
        SettingsWindowManager.open({
          path: '/',
        });
      },
    },
    {
      type: 'submenu',
      label: 'Extensions',
      submenu: Object.values(ExtensionMeta).map((meta) => {
        return {
          label: meta.name,
          type: 'normal',
          click: () => {
            ExtensionManager.openExtensionSettings(meta.id);
          },
        };
      }),
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
  return tray;
};

export const TrayManager = {
  load: load,
  getTray: () => tray,
};
