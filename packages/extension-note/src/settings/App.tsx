// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { useEffect } from 'react';
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

export function App() {
  useEffect(() => {
    window.electron.on('user-extension-updated', (data) => {
      console.log(data);
    });
  }, []);

  useEffect(() => {
    const getter = async () => {
      const extensionInfo = await window.electron.invoke<any, any>(
        'get-user-extension-info',
        Meta.extensionConfigs.uuid
      );
      const extensionItems = await window.electron.invoke<any, any>(
        'get-user-extension-items',
        Meta.extensionConfigs.uuid
      );
      console.log(extensionInfo);
      console.log(extensionItems);
    };
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
              const entity = await window.electron.invoke(
                'create-user-extension-item',
                {
                  extensionId: Meta.extensionConfigs.uuid,
                  data: {
                    title: 'New Note',
                    content: 'This is a new note',
                  },
                }
              );
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
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Text size='sm'>
                With Fjord Tours you can explore more of the magical fjord
                landscapes with tours and activities on and around the fjords of
                Norway
              </Text>
            </Card>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Text size='sm'>
                With Fjord Tours you can explore more of the magical fjord
                landscapes with tours and activities on and around the fjords of
                Norway
              </Text>
            </Card>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Text size='sm'>
                With Fjord Tours you can explore more of the magical fjord
                landscapes with tours and activities on and around the fjords of
                Norway
              </Text>
            </Card>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Text size='sm'>
                With Fjord Tours you can explore more of the magical fjord
                landscapes with tours and activities on and around the fjords of
                Norway
              </Text>
            </Card>
          </Flex>
        </ScrollArea>
      </Flex>
    </Flex>
  );
}
