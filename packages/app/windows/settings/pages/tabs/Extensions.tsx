import { ActionIcon, Checkbox, Flex, ScrollArea } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { trpc } from '../../trpc';

export function Extensions() {
  const [data] = trpc.extension.list.useSuspenseQuery();

  console.log(data);

  return (
    <ScrollArea scrollbars='y' h='100%'>
      {data.map((extension) => {
        return (
          <Flex key={extension.id} p='md' w='100%' justify='space-between'>
            <Checkbox defaultChecked label={extension.name} />
            <ActionIcon
              variant='subtle'
              color='gray'
              aria-label='Settings'
              onClick={() => {
                console.log(extension.id);
                window.electron.send('open-extension-settings', {
                  extensionId: extension.id,
                });
              }}
            >
              <IconAdjustments
                style={{ width: '70%', height: '70%' }}
                stroke={1.5}
              />
            </ActionIcon>
          </Flex>
        );
      })}
    </ScrollArea>
  );
}
