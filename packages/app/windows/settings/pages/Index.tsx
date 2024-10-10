// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { ActionIcon, Flex, rem, Tabs } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IoClose, IoAdd } from 'react-icons/io5';
import { IconMessageCircle, IconPhoto } from '@tabler/icons-react';
import { Extensions } from './tabs/Extensions';
import { Settings } from './tabs/Settings';

export function IndexPage() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const navigate = useNavigate();
  const { tabValue } = useParams();

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
                type: 'note',
              });
            }}
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
      <Tabs
        defaultValue='extensions'
        color='gray'
        value={tabValue}
        onChange={(value) => navigate(`/${value}`)}
        flex={1}
        display='flex'
        style={{ overflow: 'hidden', flexDirection: 'column' }}
      >
        <Tabs.List justify='center'>
          <Tabs.Tab
            value='extensions'
            leftSection={<IconPhoto style={iconStyle} />}
          >
            Extensions
          </Tabs.Tab>
          <Tabs.Tab
            value='messages'
            leftSection={<IconMessageCircle style={iconStyle} />}
          >
            Settings
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel
          value='extensions'
          flex={1}
          style={{ flexGrow: 0, overflow: 'hidden' }}
        >
          <Extensions />
        </Tabs.Panel>
        <Tabs.Panel
          value='messages'
          flex={1}
          style={{ flexGrow: 0, overflow: 'hidden' }}
        >
          <Settings />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
