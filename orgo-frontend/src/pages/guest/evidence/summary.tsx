import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import getStrappiUserData from '../../../data/utils/strappiUserData'

function Summary() {
  const router = useRouter()
  const strappiUserData = getStrappiUserData()

  return (
    <Box>
      <Text fontWeight="bold" my="4">
        You don't have any submissions
      </Text>
      <Text fontWeight="bold" my="4">
        Please sign up as a volunteer to send your submissions and view them
      </Text>
      <Button
        colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
        onClick={() => router.push('/register')}
      >
        Sign Up
      </Button>
    </Box>
  )
}

export default Summary
