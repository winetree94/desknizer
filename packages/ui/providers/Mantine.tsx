import { MantineProvider } from '@mantine/core';
import { PropsWithChildren } from 'react';

export function NUIMantineProvider(props: PropsWithChildren) {
  return <MantineProvider>{props.children}</MantineProvider>;
}
