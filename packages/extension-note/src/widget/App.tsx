import '@mantine/tiptap/styles.css';
import { ActionIcon, Flex, Textarea } from '@mantine/core';
import { IoClose, IoAdd } from 'react-icons/io5';
import Meta from '../../package.json';
import { NoteData } from '../shared/types.ts';
import { useWidget } from '@note/ui/providers/WidgetProvider.tsx';
import { useEffect, useState } from 'react';

export function App() {
  const widget = useWidget<NoteData>();
  const [value, setValue] = useState(widget?.extensionItem.data.content);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('update-user-extension-item', {
      id: widget.extensionItem.id,
      data: {
        content: value,
      },
    });
  }, [value]);

  return (
    <Flex direction='column' flex='1 1 auto'>
      <Flex>
        <Flex>
          <ActionIcon
            variant='subtle'
            color='black'
            aria-label='Settings'
            onClick={async () => {
              const entity = await window.electron.ipcRenderer.invoke<NoteData>(
                'create-user-extension-item',
                {
                  extensionId: Meta.extensionConfigs.uuid,
                  data: {
                    content: 'This is a new note',
                  },
                }
              );
              await window.electron.ipcRenderer.invoke('create-widget', {
                id: entity.id,
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
      <Textarea
        label='Input label'
        description='Input description'
        placeholder='Input placeholder'
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
    </Flex>
  );
}
