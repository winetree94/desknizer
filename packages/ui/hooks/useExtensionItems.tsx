import { useEffect, useState } from 'react';
import { ExtensionItem } from '@desknizer/types/entity';
import {
  IpcRendererEvent,
  OnUserExtensionItemDeletedArgs,
  OnUserExtensionItemInsertedArgs,
  OnUserExtensionItemUpdatedArgs,
} from '@desknizer/types/ipc';

export interface UseExtensionItemsProps {
  extensionId: string;
}

export function useExtensionItems<T>(props: UseExtensionItemsProps) {
  const [contents, setContents] = useState<ExtensionItem<T>[]>([]);

  useEffect(() => {
    const onUserExtensionItemInserted = (
      _: IpcRendererEvent,
      data: OnUserExtensionItemInsertedArgs<T>
    ) => {
      setContents((prev) => [
        {
          id: data.item.id,
          data: data.item.data,
        },
        ...prev,
      ]);
    };

    const onUserExtensionItemUpdated = (
      _: IpcRendererEvent,
      data: OnUserExtensionItemUpdatedArgs<T>
    ) => {
      setContents((prev) => {
        return prev.map((item) => {
          if (item.id === data.item.id) {
            return {
              id: data.item.id,
              data: data.item.data,
            };
          }
          return item;
        });
      });
    };

    const onUserExtensionItemDeleted = (
      _: IpcRendererEvent,
      data: OnUserExtensionItemDeletedArgs
    ) => {
      setContents((prev) => prev.filter((item) => item.id !== data.id));
    };

    const insertUnsubscribe = window.electron.ipcRenderer.on(
      'user-extension-item-inserted',
      onUserExtensionItemInserted
    );
    const updateUnsubscribe = window.electron.ipcRenderer.on(
      'user-extension-item-updated',
      onUserExtensionItemUpdated
    );
    const deletedUnsubscribe = window.electron.ipcRenderer.on(
      'user-extension-item-deleted',
      onUserExtensionItemDeleted
    );

    const init = async () => {
      const extensionItems = await window.electron.ipcRenderer.invoke<T>(
        'get-user-extension-items',
        {
          extensionId: props.extensionId,
        }
      );
      setContents(extensionItems.reverse());
    };

    init().then();

    return () => {
      insertUnsubscribe();
      updateUnsubscribe();
      deletedUnsubscribe();
    };
  }, []);

  return contents;
}
