import { IconButton, Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'

const GoBack = () => {
  const router = useRouter()
  const handleGoBack = () => router.back()
  return (
    <Tooltip alignSelf="start" label="Go backwards">
      <IconButton
        mb="3"
        onClick={handleGoBack}
        icon={<IoIosArrowBack size={30} />}
        aria-label="Go back"
      />
    </Tooltip>
  )
}

export default GoBack
