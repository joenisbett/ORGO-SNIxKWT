import { Box, Text } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import { VideoPlayer } from '../../components/VideoPlayer'
import getStrappiUserData from '../../data/utils/strappiUserData'

function about() {
  const strappiUserData = getStrappiUserData()

  return (
    <Box>
      <Head>
        <title>Community - Tutorials</title>
      </Head>
      <Box my="16">
        <Text textAlign="center" my="4" fontWeight="bold" fontSize="xl">
          How Do I Create a New Task Listing For My Community?
        </Text>
        <VideoPlayer videoId="u9Iqd9PflNk" />
      </Box>
      <Box my="16">
        <Text textAlign="center" my="4" fontWeight="bold" fontSize="xl">
          How Do I Review Evidence Submitted to My Community?
        </Text>
        <VideoPlayer videoId="zzDQro7yLGY" />
      </Box>
      <Box my="16">
        <Text textAlign="center" my="4" fontWeight="bold" fontSize="xl">
          How Do I Edit an Existing Task or Make a Task Inactive?
        </Text>
        <VideoPlayer videoId="ifF-j9lT40U" />
      </Box>
      <Box my="16">
        <Text textAlign="center" my="4" fontWeight="bold" fontSize="xl">
          How Do I Edit My Profile?
        </Text>
        <VideoPlayer videoId="dzURvzz1d7s" />
      </Box>
      <Box my="16">
        <Text textAlign="center" my="4" fontWeight="bold" fontSize="xl">
          How Do I Find Other Users on the{' '}
          {strappiUserData.attributes?.brand_name || ''} App?
        </Text>
        <VideoPlayer videoId="9rnuHID6LjA" />
      </Box>
    </Box>
  )
}

export default about
