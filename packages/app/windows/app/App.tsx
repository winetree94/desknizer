// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import {
  ActionIcon,
  Flex,
  MantineProvider,
  ScrollArea,
  Text,
} from '@mantine/core';
import { IoClose, IoAdd } from 'react-icons/io5';

export function App() {
  return (
    <MantineProvider>
      <Flex direction='column' flex='1 1 auto'>
        <Flex>
          <Flex>
            <ActionIcon
              variant='subtle'
              color='black'
              aria-label='Settings'
              onClick={() => {}}
            >
              <IoAdd style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
          </Flex>
          <Flex className='drag-region' flex='1 1 auto'></Flex>
          <Flex>
            <ActionIcon variant='subtle' color='black' aria-label='Settings'>
              <IoClose style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
          </Flex>
        </Flex>
        <Text>Notes</Text>
        <ScrollArea flex='1 1 auto'>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
          <div>aslkdf</div>
        </ScrollArea>
      </Flex>
    </MantineProvider>
  );
}
