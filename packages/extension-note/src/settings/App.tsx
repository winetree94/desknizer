// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
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
import { trpc } from '@note-extension/base/providers/trpc';

export function App() {
  const { data } = trpc.extension.one.useQuery({
    id: Meta.extensionConfigs.uuid,
  });

  console.log(data);

  return (
    <Flex direction='column' flex='1 1 auto'>
      <Flex>
        <Flex>
          <ActionIcon
            variant='subtle'
            color='black'
            aria-label='Settings'
            onClick={() => {
              window.electron.send('create-widget', {
                extensionId: Meta.extensionConfigs.uuid,
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
