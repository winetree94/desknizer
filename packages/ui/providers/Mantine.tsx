import {
  MantineProvider,
  createTheme,
  virtualColor,
  ActionIcon,
} from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

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
  // Big hack to make it work for now
  const [dark, setDark] = useState(false);
  const preferredColorScheme = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setDark(!!preferredColorScheme);
  }, [preferredColorScheme]);

  return (
    <MantineProvider theme={theme} forceColorScheme={dark ? 'dark' : 'light'}>
      {props.children}
    </MantineProvider>
  );
}
