import { Box } from '@chakra-ui/react'
import { IoLocationSharp } from 'react-icons/io5'

interface LocationPinProps {
  lat?: number
  lng?: number
  onClick?: () => void
}

const LocationPin = ({ onClick }: LocationPinProps) => (
  <Box
    sx={{
      mt: '-30px',
      ml: '-15px',
    }}
    cursor="pointer"
    onClick={onClick}
  >
    <IoLocationSharp size={30} />
  </Box>
)

export default LocationPin
