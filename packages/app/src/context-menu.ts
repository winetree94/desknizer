import { onIpc } from './ipc-main';
import { Menu, MenuItemConstructorOptions } from 'electron';

onIpc('show-context-menu', async (event, args) => {
  const templates = args.items.map<MenuItemConstructorOptions>(
    function Mapper(item) {
      if (item.submenu) {
        item.submenu = item.submenu.map(Mapper);
      }
      return {
        ...item,
        click: (menu) => {
          event.reply('context-menu-clicked', {
            id: item.id,
            menuId: menu.id,
            data: args.data,
          });
        },
      };
    }
  );
  console.log(templates);
  const menu = Menu.buildFromTemplate(templates);
  menu.popup();
});
