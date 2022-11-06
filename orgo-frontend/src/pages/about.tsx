import { Box, Button, Flex, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useUserData } from '../data/hooks/useUserData'
import getStrappiUserData from '../data/utils/strappiUserData'

function About() {
  const router = useRouter()
  const userData = useUserData()
  const strappiUserData = getStrappiUserData()

  return (
    <Box>
      <Head>
        <title>About Us</title>
      </Head>
      <Text textAlign="center" my="4" fontWeight="bold" fontSize="2xl">
        About Us
      </Text>
      <Text>{strappiUserData.attributes?.about_us || ''}</Text>

      {!userData && (
        <Flex
          my="6"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Button
            colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
            my="4"
            onClick={() => router.push('/register')}
          >
            Create account
          </Button>
        </Flex>
      )}
    </Box>
  )
}

export default About
