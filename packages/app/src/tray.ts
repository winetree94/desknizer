import { app, Menu, Tray } from 'electron';
import path from 'path';

let tray: Tray | null = null;

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, './icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      type: 'normal',
    },
    {
      label: 'Item2',
      type: 'normal',
    },
    {
      label: 'Item3',
      type: 'normal',
    },
    {
      label: 'Item4',
      type: 'normal',
    },
  ]);

  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
});