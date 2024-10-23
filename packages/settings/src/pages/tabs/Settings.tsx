import { Box, Checkbox, ScrollArea } from '@mantine/core';

export function Settings() {
  return (
    <ScrollArea scrollbars='y' h='100%'>
      <Box p='md'>
        <Checkbox defaultChecked label='Auto Start' />
      </Box>
    </ScrollArea>
  );
}
