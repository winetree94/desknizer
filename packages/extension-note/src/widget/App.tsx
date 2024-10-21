import '@mantine/tiptap/styles.css';
import { ActionIcon, Flex, ScrollArea } from '@mantine/core';
import Meta from '../../package.json';
import { NoteData } from '../shared/types.ts';
import { useWidget } from '@note/ui/providers/WidgetProvider.tsx';
import { useEffect, useState, useCallback } from 'react';
import '@mantine/tiptap/styles.css';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor, Editor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { debounce } from 'lodash';
import { RiCloseFill, RiAddFill } from 'react-icons/ri';
import { motion } from 'framer-motion';

export function App() {
  const widget = useWidget<NoteData>();
  const [value, setValue] = useState(widget.extensionItem.data.content);
  const [windowFocused, setWindowFocused] = useState(false);

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'on-window-focus-change',
      (_, data) => {
        setWindowFocused(data.focused);
      }
    );
    return () => unsubscribe();
  }, []);

  const debouncedUpdate = useCallback(
    debounce((editor: Editor) => {
      setValue(editor.getHTML());
    }, 500),
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
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
    <Flex direction='column' flex='1 1 auto'>
      <motion.div
        className='flex overflow-hidden'
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
            onClick={() => window.close()}
          >
            <RiCloseFill style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Flex>
      </motion.div>
      <ScrollArea>
        <RichTextEditor editor={editor} style={{ border: 'none' }}>
          <RichTextEditor.Content />
        </RichTextEditor>
      </ScrollArea>
    </Flex>
  );
}
