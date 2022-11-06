import { Avatar, Box, Flex, Text, Link, Divider } from '@chakra-ui/react'
import React from 'react'

// evidence submits
// evidence status changes from to be reviewed to reviewed
function NotificationsScreen() {
  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold">
        Recent Activities
      </Text>

      <Flex my="6">
        <Avatar
          size="lg"
          name="Ryan Florence"
          src="https://bit.ly/ryan-florence"
        />
        <Box mx="4">
          <Text color="gray.500">
            Ryan Florence submitted the evidence for:
          </Text>
          <Link fontWeight="bold">Complete the ball assignment</Link>
        </Box>
      </Flex>

      <Divider />

      <Flex my="6">
        <Avatar
          size="lg"
          name="Segun Adebayo"
          src="https://bit.ly/sage-adebayo"
        />

        <Box mx="4">
          <Text color="gray.500">Segun Adebayo reviewed the evidence for:</Text>
          <Link fontWeight="bold">Complete the ball assignment</Link>
        </Box>
      </Flex>
    </Box>
  )
}

export default NotificationsScreen
