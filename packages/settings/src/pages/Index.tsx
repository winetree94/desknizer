import { Flex, rem, Tabs } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IconMessageCircle, IconPhoto } from '@tabler/icons-react';
import { Extensions } from './tabs/Extensions';
import { Settings } from './tabs/Settings';
import { Toolbar } from '@desknizer/ui/components/Toolbar.tsx';

export function IndexPage() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const navigate = useNavigate();
  const { tabValue } = useParams();

  return (
    <Flex direction='column' flex='1 1 auto'>
      <Toolbar />
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
            value='settings'
            leftSection={<IconMessageCircle style={iconStyle} />}
          >
            Settings
          </Tabs.Tab>
          {/*<Tabs.Tab*/}
          {/*  value='tester'*/}
          {/*  leftSection={<IconMessageCircle style={iconStyle} />}*/}
          {/*>*/}
          {/*  Tester*/}
          {/*</Tabs.Tab>*/}
        </Tabs.List>
        <Tabs.Panel
          value='extensions'
          flex={1}
          style={{ flexGrow: 0, overflow: 'hidden' }}
        >
          <Extensions />
        </Tabs.Panel>
        <Tabs.Panel
          value='settings'
          flex={1}
          style={{ flexGrow: 0, overflow: 'hidden' }}
        >
          <Settings />
        </Tabs.Panel>
        {/*<Tabs.Panel*/}
        {/*  value='tester'*/}
        {/*  flex={1}*/}
        {/*  style={{ flexGrow: 0, overflow: 'hidden' }}*/}
        {/*>*/}
        {/*  <Tester />*/}
        {/*</Tabs.Panel>*/}
      </Tabs>
    </Flex>
  );
}
