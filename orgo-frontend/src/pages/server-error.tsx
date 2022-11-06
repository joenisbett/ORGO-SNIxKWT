import { Box, Text } from '@chakra-ui/react'
import Head from 'next/head'

const ServerError500 = () => {
  return (
    <>
      <Head>
        <title>500 - Server Error</title>
      </Head>
      <Box ml="20">
        <Text>Server Error</Text>
        <Text>please try again later.</Text>
      </Box>
    </>
  )
}

export default ServerError500
