import {
  MantineProvider,
  createTheme,
  virtualColor,
  ActionIcon,
} from '@mantine/core';
import { PropsWithChildren } from 'react';

const theme = createTheme({
  colors: {
    light: virtualColor({
      name: 'light',
      dark: 'gray',
      light: 'dark',
    }),
  },
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        color: 'light',
      },
    }),
  },
});

export function NUIMantineProvider(props: PropsWithChildren) {
  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      {props.children}
    </MantineProvider>
  );
}
