import '@mantine/tiptap/styles.css';
import { ActionIcon, Flex, ScrollArea, Drawer } from '@mantine/core';
import Meta from '../../package.json';
import { NoteData } from '../shared/types.ts';
import { useWidget } from '@note/ui/providers/WidgetProvider.tsx';
import { useEffect, useState, useCallback } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { useDisclosure } from '@mantine/hooks';
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { debounce } from 'lodash-es';
import { RiCloseFill, RiAddFill, RiMoreFill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useWindowFocused } from '@note/ui/hooks/useWindowFocused';

export function App() {
  const widget = useWidget<NoteData>();
  const [opened, { open, close }] = useDisclosure(false);
  const windowFocused = useWindowFocused();
  const [value, setValue] = useState(widget.extensionItem.data.content);

  const debouncedUpdate = useCallback(
    debounce((editor: Editor) => {
      setValue(editor.getHTML());
    }, 500),
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false,
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      debouncedUpdate(editor);
    },
  });

  useEffect(() => {
    window.electron.ipcRenderer.invoke('update-user-extension-item', {
      id: widget.extensionItem.id,
      data: {
        content: value,
      },
    });
  }, [value]);

  return (
    <Flex direction='column' flex='1 1 auto' className='h-full'>
      <Drawer opened={opened} onClose={close} position='top' size='100%'>
        <div>
          <div>Hello World!</div>
        </div>
      </Drawer>
      <motion.div
        className='flex overflow-hidden flex-shrink-0'
        animate={windowFocused ? 'open' : 'closed'}
        transition={{
          ease: 'linear',
        }}
        variants={{
          open: {
            y: 0,
          },
          closed: {
            y: -30,
          },
        }}
      >
        <Flex>
          <ActionIcon
            variant='subtle'
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
            <RiAddFill style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Flex>
        <Flex className='drag-region' flex='1 1 auto'></Flex>
        <Flex>
          <ActionIcon
            variant='subtle'
            aria-label='Settings'
            onClick={() => open()}
          >
            <RiMoreFill style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
          <ActionIcon
            variant='subtle'
            aria-label='Settings'
            onClick={() => window.close()}
          >
            <RiCloseFill style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Flex>
      </motion.div>
      <RichTextEditor
        editor={editor}
        className='border-none flex flex-col justify-items-end flex-1 overflow-hidden'
      >
        <ScrollArea className='flex-1' scrollbars='y'>
          <RichTextEditor.Content />
        </ScrollArea>
        <RichTextEditor.Toolbar
          className={`flex-shrink-0 border-none p-2 ${windowFocused ? 'visible' : 'hidden'}`}
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Code />
            <RichTextEditor.Hr />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      </RichTextEditor>
    </Flex>
  );
}
