import { onIpc } from './ipc-main';
import { Menu } from 'electron';

onIpc('show-context-menu', async (event, args) => {
  const menu = Menu.buildFromTemplate(
    args.items.map((item) => {
      if ('id' in item) {
        return {
          id: item.id,
          label: item.label,
          click: () => {
            event.reply('context-menu-clicked', {
              id: item.id,
              data: item.data,
            });
          },
        };
      } else {
        return item;
      }
    })
  );
  menu.popup();
});
