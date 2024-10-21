// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { useState, useEffect } from 'react';
import '@mantine/tiptap/styles.css';
import {
  Divider,
  ActionIcon,
  Flex,
  ScrollArea,
  Text,
  Card,
  Input,
} from '@mantine/core';
import { RiCloseFill, RiAddFill, RiMoreFill } from 'react-icons/ri';
import Meta from '../../package.json';
import { ExtensionItem } from '@note/types/entity';
import {
  IpcRendererEvent,
  OnContextMenuClickedArgs,
  OnUserExtensionItemDeletedArgs,
  OnUserExtensionItemInsertedArgs,
  OnUserExtensionItemUpdatedArgs,
} from '@note/types/ipc';
import { NoteData } from '../shared/types.ts';

export function App() {
  const [contents, setContents] = useState<ExtensionItem<NoteData>[]>([]);

  useEffect(() => {
    const contextMenuClicked = (
      _: IpcRendererEvent,
      data: OnContextMenuClickedArgs<{ id: string }>
    ) => {
      switch (data.id) {
        case 'open-widget':
          window.electron.ipcRenderer.invoke('create-widget', {
            id: data.data.id,
          });
          break;
        case 'delete':
          window.electron.ipcRenderer.invoke('delete-user-extension-item', {
            id: data.data.id,
          });
          break;
      }
    };

    const onUserExtensionItemInserted = (
      _: IpcRendererEvent,
      data: OnUserExtensionItemInsertedArgs<NoteData>
    ) => {
      setContents((prev) => [
        {
          id: data.item.id,
          data: {
            content: data.item.data.content,
          },
        },
        ...prev,
      ]);
    };

    const onUserExtensionItemUpdated = (
      _: IpcRendererEvent,
      data: OnUserExtensionItemUpdatedArgs<NoteData>
    ) => {
      setContents((prev) => {
        return prev.map((item) => {
          if (item.id === data.item.id) {
            return {
              id: data.item.id,
              data: {
                content: data.item.data.content,
              },
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

    const contextMenuClickedUnsubscribe = window.electron.ipcRenderer.on(
      'context-menu-clicked',
      contextMenuClicked
    );

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
      const extensionItems = await window.electron.ipcRenderer.invoke<NoteData>(
        'get-user-extension-items',
        {
          extensionId: Meta.extensionConfigs.uuid,
        }
      );
      setContents(extensionItems.reverse());
    };

    init().then();

    return () => {
      contextMenuClickedUnsubscribe();
      insertUnsubscribe();
      updateUnsubscribe();
      deletedUnsubscribe();
    };
  }, []);

  useEffect(() => {
    const getter = async () => {
      // const extensionInfo = await window.electron.ipcRenderer.invoke<NoteMeta>(
      //   'get-user-extension-info',
      //   {
      //     extensionId: Meta.extensionConfigs.uuid,
      //   }
      // );
      const extensionItems = await window.electron.ipcRenderer.invoke<NoteData>(
        'get-user-extension-items',
        {
          extensionId: Meta.extensionConfigs.uuid,
        }
      );
      setContents(() => extensionItems);
    };
    getter().then();
  }, []);

  return (
    <Flex direction='column' flex='1 1 auto'>
      <Flex>
        <Flex>
          <ActionIcon
            variant='subtle'
            aria-label='Settings'
            onClick={async () => {
              const entity = await window.electron.ipcRenderer.invoke<NoteData>(
                'create-user-extension-item',
                {
                  extensionId: Meta.extensionConfigs.uuid,
                  data: {
                    content: 'This is a new note',
                  },
                }
              );
              await window.electron.ipcRenderer.invoke('create-widget', {
                id: entity.id,
              });
            }}
          >
            <RiAddFill style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Flex>
        <Flex className='drag-region' flex='1 1 auto'></Flex>
        <Flex>
          <ActionIcon
            variant='subtle'
            aria-label='Settings'
            onClick={() => window.close()}
          >
            <RiCloseFill style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Flex>
      </Flex>
      <Flex flex={1} direction='column' style={{ overflow: 'hidden' }}>
        <Flex pb='xs' pl='xs' pr='xs' direction='column'>
          <Text size='xl'>Notes</Text>
          <Input mt='sm' placeholder='Search...' />
        </Flex>
        <Divider />
        <ScrollArea flex={1} scrollbars='y' h='100%' pl='sm' pr='sm'>
          <Flex direction='column' gap='sm' pb='sm' pt='sm'>
            {contents.map((content) => (
              <Card
                key={content.id}
                shadow='sm'
                padding='sm'
                radius='md'
                withBorder
                onDoubleClick={async () => {
                  await window.electron.ipcRenderer.invoke('create-widget', {
                    id: content.id,
                  });
                }}
                style={{ userSelect: 'none' }}
              >
                <Flex justify='flex-end'>
                  <ActionIcon
                    variant='subtle'
                    aria-label='Settings'
                    size='sm'
                    onClick={async (e) => {
                      e.stopPropagation();
                      window.electron.ipcRenderer.send<{
                        id: string;
                      }>('show-context-menu', {
                        items: [
                          {
                            id: 'open-widget',
                            label: 'Open',
                            data: {
                              id: content.id,
                            },
                          },
                          {
                            id: 'delete',
                            label: 'Delete',
                            data: {
                              id: content.id,
                            },
                          },
                        ],
                      });
                    }}
                  >
                    <RiMoreFill style={{ width: '70%', height: '70%' }} />
                  </ActionIcon>
                </Flex>
                <Text size='sm'>{content.data.content}</Text>
              </Card>
            ))}
          </Flex>
        </ScrollArea>
      </Flex>
    </Flex>
  );
}
