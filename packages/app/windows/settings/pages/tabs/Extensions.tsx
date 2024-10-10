import { ActionIcon, Checkbox, Flex, ScrollArea } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function Extensions() {
  const [extensions, setExtensions] = useState([]);

  useEffect(() => {
    window.electron.invoke<void, {}>('get-extensions').then((extensions) => {
      console.log(extensions);
    });
  }, []);

  return (
    <ScrollArea scrollbars='y' h='100%'>
      <Flex p='md' w='100%' justify='space-between'>
        <Checkbox defaultChecked label='Note' />
        <ActionIcon variant='subtle' color='gray' aria-label='Settings'>
          <IconAdjustments
            style={{ width: '70%', height: '70%' }}
            stroke={1.5}
          />
        </ActionIcon>
      </Flex>
      <Flex p='md' w='100%' justify='space-between'>
        <Checkbox defaultChecked label='Calendar' />
        <ActionIcon variant='subtle' color='gray' aria-label='Settings'>
          <IconAdjustments
            style={{ width: '70%', height: '70%' }}
            stroke={1.5}
          />
        </ActionIcon>
      </Flex>
    </ScrollArea>
  );
}
