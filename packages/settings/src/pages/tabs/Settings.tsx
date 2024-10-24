import { Box, Checkbox, ScrollArea } from '@mantine/core';
import { useLoginItem } from '@desknizer/ui/hooks/useLoginItem';

export function Settings() {
  const { isLoginItem, setIsLoginItem } = useLoginItem();
  return (
    <ScrollArea scrollbars='y' h='100%'>
      <Box p='md'>
        <Checkbox
          label='Auto Start'
          checked={isLoginItem}
          onChange={(event) => {
            setIsLoginItem(event.currentTarget.checked);
          }}
        />
      </Box>
    </ScrollArea>
  );
}
