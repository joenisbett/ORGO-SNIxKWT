import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import { useState } from 'react'
import Geocode from 'react-geocode'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import getStrappiUserData from '../../data/utils/strappiUserData'
import { EditableMapView } from './Map'

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
  isLoading: boolean
  handleConfirm: ({
    location,
    locationOnMap,
  }: {
    location: any
    locationOnMap: any
  }) => void
}

Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

const MapModal = ({
  isOpen,
  onClose,
  data,
  isLoading,
  handleConfirm,
}: MapModalProps) => {
  const strappiUserData = getStrappiUserData()

  const [isLargerThan950] = useMediaQuery('(min-width: 950px)')
  const [isLargerThan475] = useMediaQuery('(min-width: 475px)')

  const [latLng, setLatLng] = useState(null)
  const [foundAddress, setFoundAddress] = useState(null)

  const handleMapClick = async (e) => {
    setLatLng({ lat: e.lat, lng: e.lng })

    try {
      const res = await Geocode.fromLatLng(e.lat, e.lng)
      const formattedAddress = res.results[0].formatted_address
      setFoundAddress(formattedAddress)
    } catch (err) {
      console.log('err from geocode: ', err)
    }
  }

  const responsiveAddressText = (
    foundAddress: string,
    isLargerThan475: boolean
  ): string => {
    if (isLargerThan475) {
      if (foundAddress) {
        return `Address: ${foundAddress}`
      } else if (data?.city) {
        return `Address: ${data?.city}`
      } else {
        return 'Pin your location'
      }
    } else {
      if (foundAddress) {
        return foundAddress.length > 25
          ? `${foundAddress.slice(0, 25)}...`
          : foundAddress
      } else if (data?.city) {
        return data?.city?.length > 25
          ? `${data?.city?.slice(0, 25)}...`
          : data?.city
      } else {
        return 'Pin your location'
      }
    }
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size={isLargerThan950 ? '4xl' : 'full'}
    >
      <ModalOverlay />
      <ModalContent borderRadius="none" position="relative">
        <ModalBody p={0} h={isLargerThan950 ? '705px' : '100vh'}>
          <Box
            sx={{
              h: isLargerThan950 ? '650px' : 'calc(100vh - 75px)',
              w: '100%',
            }}
          >
            <EditableMapView
              zoomLevel={10}
              handleClick={handleMapClick}
              location={
                latLng || {
                  lat: data?.locationOnMap?.latitude,
                  lng: data?.locationOnMap?.longitude,
                }
              }
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              height: isLargerThan950 ? '55px' : '75px',
              px: isLargerThan475 ? 5 : 3,
              py: isLargerThan475 ? 0 : 2,
              display: 'flex',
              flexDirection: isLargerThan475 ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text fontWeight="bold" color="gray.700" mr="3">
              {responsiveAddressText(foundAddress, isLargerThan475)}
            </Text>
            <HStack w={isLargerThan475 ? 'auto' : '100%'}>
              <Button
                colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
                isLoading={isLoading}
                size="sm"
                disabled={!foundAddress}
                w={isLargerThan475 ? 'auto' : '100%'}
                onClick={() =>
                  handleConfirm({
                    location: foundAddress,
                    locationOnMap: {
                      latitude: latLng?.lat,
                      longitude: latLng?.lng,
                    },
                  })
                }
              >
                Confirm
              </Button>
              {isLargerThan475 ? (
                <Button size="sm" onClick={onClose}>
                  Cancel
                </Button>
              ) : null}
            </HStack>
          </Box>
        </ModalBody>
        <Box position="absolute" top="2" left="2" onClick={onClose}>
          {!isLargerThan475 ? <AiOutlineArrowLeft fontSize={26} /> : null}
        </Box>
      </ModalContent>
    </Modal>
  )
}
export default MapModal
