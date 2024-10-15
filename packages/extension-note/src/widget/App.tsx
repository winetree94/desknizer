// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/tiptap/styles.css';
import { ActionIcon, Flex, Text } from '@mantine/core';
import { IoClose, IoAdd } from 'react-icons/io5';
import Meta from '../../package.json';

export function App() {
  return (
    <Flex direction='column' flex='1 1 auto'>
      <Flex>
        <Flex>
          <ActionIcon
            variant='subtle'
            color='black'
            aria-label='Settings'
            onClick={() => {
              window.electron.ipcRenderer.invoke('create-widget', {
                id: Meta.extensionConfigs.uuid,
                data: {
                  x: 0,
                  y: 0,
                },
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
      <Text>Note Content</Text>
      <Flex></Flex>
    </Flex>
  );
}
