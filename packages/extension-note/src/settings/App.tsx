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
import { IoClose, IoAdd } from 'react-icons/io5';
import Meta from '../../package.json';

interface NoteItem {
  id: string;
  data: {
    content: string;
  };
}

export function App() {
  const [contents, setContents] = useState<NoteItem[]>([]);

  useEffect(() => {
    window.electron.on('user-extension-updated', (data) => {
      console.log(data);
    });
  }, []);

  useEffect(() => {
    const getter = async () => {
      const extensionInfo = await window.electron.invoke<
        {
          extensionId: string;
        },
        {
          id: string;
          meta: {};
        }
      >('get-user-extension-info', {
        extensionId: Meta.extensionConfigs.uuid,
      });

      const extensionItems = await window.electron.invoke<
        {
          extensionId: string;
        },
        NoteItem[]
      >('get-user-extension-items', {
        extensionId: Meta.extensionConfigs.uuid,
      });

      setContents(() => extensionItems);
    };

    window.electron.on('user-extension-item-inserted', (event, data) => {
      console.log('inserted', event, data);
    });

    getter();
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
              const entity = await window.electron.invoke<
                {
                  extensionId: string;
                  data: {
                    content: string;
                  };
                },
                {
                  id: string;
                  meta: {};
                }
              >('create-user-extension-item', {
                extensionId: Meta.extensionConfigs.uuid,
                data: {
                  content: 'This is a new note',
                },
              });
              await window.electron.invoke('create-widget', {
                dataId: entity.id,
              });
              console.log(entity);
              // window.electron.send('create-widget', {
              //   extensionId: Meta.extensionConfigs.uuid,
              // });
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
              >
                <Text size='sm'>{content.data.content}</Text>
              </Card>
            ))}
          </Flex>
        </ScrollArea>
      </Flex>
    </Flex>
  );
}
