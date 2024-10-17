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
import { IoClose, IoAdd, IoTrashOutline } from 'react-icons/io5';
import Meta from '../../package.json';
import { ExtensionItem } from '@note/types/entity';
import {
  IpcRendererEvent,
  OnUserExtensionItemDeletedArgs,
  OnUserExtensionItemInsertedArgs,
  OnUserExtensionItemUpdatedArgs,
} from '@note/types/ipc';

interface NoteData {
  content: string;
}

export function App() {
  const [contents, setContents] = useState<ExtensionItem<NoteData>[]>([]);

  useEffect(() => {
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
            color='black'
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
            <IoAdd style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Flex>
        <Flex className='drag-region' flex='1 1 auto'></Flex>
        <Flex>
          <ActionIcon
            variant='subtle'
            color='black'
            aria-label='Settings'
            onClick={() => window.close()}
          >
            <IoClose style={{ width: '70%', height: '70%' }} />
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
                padding='lg'
                radius='md'
                withBorder
                onClick={async () => {
                  await window.electron.ipcRenderer.invoke('create-widget', {
                    id: content.id,
                  });
                }}
              >
                <Text size='sm'>{content.data.content}</Text>
                <ActionIcon
                  variant='subtle'
                  color='black'
                  aria-label='Settings'
                  onClick={async (e) => {
                    e.stopPropagation();
                    await window.electron.ipcRenderer.invoke(
                      'delete-user-extension-item',
                      {
                        id: content.id,
                      }
                    );
                  }}
                >
                  <IoTrashOutline style={{ width: '70%', height: '70%' }} />
                </ActionIcon>
              </Card>
            ))}
          </Flex>
        </ScrollArea>
      </Flex>
    </Flex>
  );
}
