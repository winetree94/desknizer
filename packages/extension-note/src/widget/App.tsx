import '@mantine/tiptap/styles.css';
import { ActionIcon, Flex, ScrollArea, Drawer } from '@mantine/core';
import Meta from '../../package.json';
import { NoteData } from '../shared/types.ts';
import { useWidget } from '@desknizer/ui/providers/WidgetProvider.tsx';
import { useEffect, useState, useCallback } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { useDisclosure } from '@mantine/hooks';
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { debounce } from 'lodash-es';
import { RiAddFill, RiMoreFill } from 'react-icons/ri';
import { useWindowFocused } from '@desknizer/ui/hooks/useWindowFocused';
import { Toolbar } from '@desknizer/ui/components/Toolbar.tsx';
import { motion } from 'framer-motion';

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
      <Toolbar
        autoHide={true}
        leftContents={
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
        }
        rightContents={
          <ActionIcon
            variant='subtle'
            aria-label='Settings'
            onClick={() => open()}
          >
            <RiMoreFill style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        }
      />
      <RichTextEditor
        editor={editor}
        className='border-none flex flex-col justify-items-end flex-1 overflow-hidden'
      >
        <ScrollArea
          className='flex-1 cursor-text'
          scrollbars='y'
          onClick={() => editor?.commands.focus()}
        >
          <RichTextEditor.Content />
        </ScrollArea>
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
            },
          }}
          animate={windowFocused ? 'visible' : 'hidden'}
          transition={{ delay: 0.1 }}
        >
          <RichTextEditor.Toolbar className={`flex-shrink-0 border-none p-2`}>
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
        </motion.div>
      </RichTextEditor>
    </Flex>
  );
}
