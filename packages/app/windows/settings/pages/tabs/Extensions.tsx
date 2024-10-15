import { ActionIcon, Checkbox, Flex, ScrollArea } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function Extensions() {
  const [data, setData] = useState<
    {
      id: string;
      name: string;
      description: string;
    }[]
  >([]);

  useEffect(() => {
    const runner = async () => {
      const extensions =
        await window.electron.ipcRenderer.invoke('get-extensions');
      setData(extensions);
    };
    runner();
  }, []);

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
                window.electron.ipcRenderer.invoke('open-extension-settings', {
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
