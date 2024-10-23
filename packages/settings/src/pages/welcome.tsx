import { Button, Flex, Image, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export function Webcome() {
  return (
    <Flex direction='column' p='xl' justify='center' align='center' w='100%'>
      <Image radius='md' src='/welcome-image.png' className='max-h-[300px]' />
      <Text mt='30' className='text-4xl'>
        DESKNIZER
      </Text>
      <Link to='/'>
        <Button w='200' mt='30'>
          Start
        </Button>
      </Link>
    </Flex>
  );
}
