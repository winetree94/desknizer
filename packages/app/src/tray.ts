import { app, Menu, Tray } from 'electron';
import path from 'path';
import { SettingsWindowManager } from './settings';

let tray: Tray | null = null;

const load = async () => {
  if (tray) {
    return tray;
  }
  await app.whenReady();
  tray = new Tray(path.join(__dirname, './icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      type: 'normal',
      click: () => {
        SettingsWindowManager.open();
      },
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
