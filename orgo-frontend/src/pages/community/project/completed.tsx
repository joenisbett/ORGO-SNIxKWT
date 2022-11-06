import { Box, Button, Image, Text } from '@chakra-ui/react'
import Head from 'next/head'
import getStrappiUserData from '../../../data/utils/strappiUserData'

function CompletedProjects() {
  const strappiUserData = getStrappiUserData()

  return (
    <>
      <Head>
        <title>Completed Projects</title>
      </Head>
      <Box
        sx={{
          mb: '6',
        }}
      >
        <Text fontSize="xl" fontWeight="bold">
          Completed Projects
        </Text>
        <Text>You can retire the following projects</Text>
      </Box>

      {[1, 2].map((item) => (
        <Box
          key={item}
          bgColor="gray.100"
          mb="4"
          sx={{
            display: 'flex',
          }}
        >
          <Image
            src="https://bit.ly/dan-abramov"
            alt="Dan Abramov"
            height="32"
            width="40%"
            objectFit="cover"
          />
          <Box p="3">
            <Text fontSize="lg" fontWeight="bold">
              Plant 1000 Trees in barren land
            </Text>
            <Text>$ 1999.99</Text>
            <Button
              colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
              my="2"
              px="5"
            >
              Retire
            </Button>
          </Box>
        </Box>
      ))}
    </>
  )
}

export default CompletedProjects
