import { motion } from 'framer-motion';
import { ActionIcon, Flex } from '@mantine/core';
import { RiCloseFill } from 'react-icons/ri';
import { useWindowFocused } from '../hooks/useWindowFocused.tsx';

export interface ToolbarProps {
  autoHide?: boolean;
  height?: number;
  leftContents?: React.ReactNode;
  rightContents?: React.ReactNode;
}

const transition = {
  ease: 'linear',
};

export function Toolbar(props: ToolbarProps) {
  const windowFocused = useWindowFocused();
  const variants = {
    open: {
      y: 0,
    },
    closed: {
      y: props.height ? -props.height : -30,
    },
  };

  return (
    <Flex
      className='flex overflow-hidden flex-shrink-0'
      style={{ height: props.height }}
    >
      <motion.div
        className='flex'
        animate={!props.autoHide ? false : windowFocused ? 'open' : 'closed'}
        transition={transition}
        variants={variants}
      >
        {props.leftContents}
      </motion.div>
      <Flex className='drag-region h-full' flex='1 1 auto'></Flex>
      <motion.div
        className='flex'
        animate={!props.autoHide ? false : windowFocused ? 'open' : 'closed'}
        transition={transition}
        variants={variants}
      >
        {props.rightContents}
        <ActionIcon
          variant='subtle'
          aria-label='Settings'
          onClick={() => window.close()}
        >
          <RiCloseFill style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </motion.div>
    </Flex>
  );
}
