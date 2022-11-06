import { Box, Image } from '@chakra-ui/react'
import Head from 'next/head'

const WaitingList = () => {
  return (
    <>
      <Head>
        <title>Coming Soon</title>
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image
          src="https://cdn.dribbble.com/users/88000/screenshots/2487367/shot.png"
          alt="coming soon"
          height="100%"
        />
      </Box>
    </>
  )
}

export default WaitingList
