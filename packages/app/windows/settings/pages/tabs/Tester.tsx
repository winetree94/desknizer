import { Group, Button, ScrollArea, Fieldset, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export function Tester() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
  });

  const onSignUp = async (values: typeof form.values) => {
  };

  return (
    <ScrollArea scrollbars='y' h='100%' p={12}>
      <form onSubmit={form.onSubmit(onSignUp)}>
        <Fieldset legend='Create User'>
          <TextInput
            label='Email'
            placeholder='Email'
            {...form.getInputProps('email')}
          />
          <TextInput
            label='Password'
            placeholder='Password'
            mt='md'
            type='password'
            {...form.getInputProps('password')}
          />
          <Group justify='flex-end' mt='md'>
            <Button type='submit'>Submit</Button>
          </Group>
        </Fieldset>
      </form>
    </ScrollArea>
  );
}
