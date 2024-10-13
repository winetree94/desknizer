import { ActionIcon, Checkbox, Flex, ScrollArea } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function Extensions() {
  const [data, setData] = useState<
    {
      uuid: string;
      name: string;
      description: string;
    }[]
  >([]);

  useEffect(() => {
    const runner = async () => {
      const extensions = (await window.electron.invoke('get-extensions')) as {
        [key: string]: {
          name: string;
          description: string;
          uuid: string;
        };
      };
      setData(Object.values(extensions));
    };
    runner();
  }, []);

  return (
    <ScrollArea scrollbars='y' h='100%'>
      {data.map((extension) => {
        return (
          <Flex key={extension.uuid} p='md' w='100%' justify='space-between'>
            <Checkbox defaultChecked label={extension.name} />
            <ActionIcon
              variant='subtle'
              color='gray'
              aria-label='Settings'
              onClick={() => {
                console.log(extension.uuid);
                window.electron.send('open-extension-settings', {
                  extensionId: extension.uuid,
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
