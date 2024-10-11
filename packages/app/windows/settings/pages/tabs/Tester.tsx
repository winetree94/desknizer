import { ScrollArea, Fieldset, TextInput } from '@mantine/core';
import { trpc } from '../../trpc';

export function Tester() {
  const { data } = trpc.account.list.useQuery();
  console.log(data);

  return (
    <ScrollArea scrollbars='y' h='100%' p={12}>
      <Fieldset legend='Create User'>
        <TextInput label='Your name' placeholder='Your name' />
        <TextInput label='Email' placeholder='Email' mt='md' />
      </Fieldset>
    </ScrollArea>
  );
}
