import { useEffect, useRef } from 'react';
import {
  IpcRendererEvent,
  OnContextMenuClickedArgs,
  SerializableMenuItemConstructorOptions,
} from '@note/types/ipc';
import { uniqueId } from 'lodash-es';

export interface ContextMenuItem<T>
  extends Omit<SerializableMenuItemConstructorOptions, 'submenu'> {
  click: (data: T) => void;
  submenu?: ContextMenuItem<T>[];
}

export interface UseContextMenuProps<T> {
  items: ContextMenuItem<T>[];
}

export function useNativeContextMenu<T>(props: UseContextMenuProps<T>) {
  const id = useRef(uniqueId('context-menu-'));

  const flattenItems = props.items.reduce<
    Omit<ContextMenuItem<T>, 'submenu'>[]
  >(function runner(result, item) {
    if (item.submenu) {
      item.submenu.forEach((item) => {
        runner(result, item);
      });
    }
    result.push({
      ...item,
    });
    return result;
  }, []);

  useEffect(() => {
    const contextMenuClicked = (
      _: IpcRendererEvent,
      data: OnContextMenuClickedArgs<T>
    ) => {
      if (data.id === id.current) {
        return;
      }
      const item = flattenItems.find((item) => item.id === data.menuId);
      if (item) {
        item.click(data.data);
      }
    };

    const contextMenuClickedUnsubscribe = window.electron.ipcRenderer.on(
      'context-menu-clicked',
      contextMenuClicked
    );

    return () => {
      contextMenuClickedUnsubscribe();
    };
  }, []);

  return {
    open: (data: T) => {
      const serializedItems =
        props.items.map<SerializableMenuItemConstructorOptions>(
          function mapper(item): SerializableMenuItemConstructorOptions {
            if (item.submenu) {
              return {
                ...item,
                submenu: item.submenu.map(mapper),
              };
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { click, ...rest } = item;
            return rest;
          }
        );
      window.electron.ipcRenderer.send<T>('show-context-menu', {
        id: id.current,
        items: serializedItems,
        data: data,
      });
    },
  };
}
