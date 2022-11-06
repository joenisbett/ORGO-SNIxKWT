import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccountVerification } from '../data/hooks/mutations/useAccountVerification'
import getStrappiUserData from '../data/utils/strappiUserData'

function Verification() {
  const strappiUserData = getStrappiUserData()
  const { isLoading, mutate } = useAccountVerification()

  const [otp, setOtp] = useState('')

  const router = useRouter()

  const handleAccountVerification = () => {
    mutate({ id: router.query.userId as string, otp })
  }
  return (
    <Box>
      <Head>
        <title>Email Verification</title>
      </Head>
      <VStack spacing={4} alignSelf="flex-start" my="14">
        <Text fontWeight="bold" fontSize="3xl">
          Verify your account
        </Text>
        <Text fontWeight="bold" fontSize="lg" textAlign="center">
          We emailed you an OTP code.
          <br />
          Enter the code below to verify your account.
        </Text>
        <Input
          placeholder="Enter your otp here"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button
          isFullWidth
          isLoading={isLoading}
          onClick={handleAccountVerification}
          colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
        >
          Verify Account
        </Button>
      </VStack>
    </Box>
  )
}

export default Verification
