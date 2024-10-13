import { MantineProvider } from '@mantine/core';
import { PropsWithChildren } from 'react';

export function ExtensionMantineProvider(props: PropsWithChildren) {
  return <MantineProvider>{props.children}</MantineProvider>;
}
