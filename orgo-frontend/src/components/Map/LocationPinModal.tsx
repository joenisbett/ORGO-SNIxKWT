import {
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Link,
  Avatar,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { AiOutlineRight } from 'react-icons/ai'
import getStrappiUserData from '../../data/utils/strappiUserData'

interface LocationPinModalProps {
  isOpen: boolean
  onClose: () => void
  name: string
  city: string
  logo: string
}

const LocationPinModal = ({
  isOpen,
  onClose,
  name,
  city,
  logo,
}: LocationPinModalProps) => {
  const strappiUserData = getStrappiUserData()

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="sm">
      <ModalOverlay />
      <ModalContent borderRadius="lg" position="relative">
        <ModalBody py={4} px={6}>
          <Center>
            <Avatar
              borderRadius="full"
              boxSize="100px"
              src={logo}
              name={name}
              size="xl"
            />
          </Center>
          <Center mt="4" flexDirection="column">
            <Text fontSize="xl" fontWeight="bold">
              {name}
            </Text>
            <Text mb="2" fontSize="sm">
              {city}
            </Text>
            <NextLink href={`/community/profile/${name}`} passHref>
              <Link
                fontSize="sm"
                color={`${
                  strappiUserData.attributes?.brand_color || 'blue'
                }.500`}
              >
                <Text
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  View Profile{' '}
                  <AiOutlineRight fontSize={13} style={{ marginLeft: '2px' }} />
                </Text>
              </Link>
            </NextLink>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default LocationPinModal
