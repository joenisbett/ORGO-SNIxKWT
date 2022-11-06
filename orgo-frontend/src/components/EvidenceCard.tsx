import { Badge, Box, Button, Flex, Text, Tooltip, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React from 'react'
import { useUserData } from '../data/hooks/useUserData'
import { EventCategory, logEvent } from '../data/utils/analytics'

export interface EvidenceCardProps {
  title: string
  status: string
  priority: 'low' | 'medium' | 'high'
  location: string
  creatorCommunityName: string
  id: string
  rewards: string
  showPriority?: boolean
  showDetails?: boolean
  showStatus?: boolean
}

const EvidenceStatusToBGColor = {
  approved: 'green.300',
  'To be approved': 'gray.300',
  denied: 'red.300',
}

const EvidencePriorityToColor = {
  low: 'gray.300',
  medium: 'yellow.300',
  high: 'red.400',
}

const EvidenceStatusToLabel = {
  'To be approved': 'Under review',
  approved: 'Approved',
  denied: 'Denied',
}

const EvidencePriorityToLabel = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  location,
  status,
  title,
  priority,
  creatorCommunityName,
  id,
  rewards,
  showPriority = true,
  showDetails = true,
  showStatus = true,
}) => {
  const router = useRouter()
  const userData = useUserData()
  return (
    <Box
      onClick={() => {
        logEvent(EventCategory.SUBMISSION, `Clicked on a submitted task`)
        router.push(`/${userData?.type}/evidence/details/${id}`)
      }}
      bg="gray.200"
      p="2"
      cursor="pointer"
      my="5"
      borderRadius="5px"
    >
      <Box mx="4">
        <Flex alignItems="center" my="1" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          <Box>
            {showStatus && (
              <Tooltip label="Evidence Status">
                <Badge mr="2" bg={EvidenceStatusToBGColor[status]}>
                  {EvidenceStatusToLabel[status]}
                </Badge>
              </Tooltip>
            )}

            {showPriority && (
              <Tooltip label="Evidence Priority">
                <Badge bg={EvidencePriorityToColor[priority]}>
                  {EvidencePriorityToLabel[priority]}
                </Badge>
              </Tooltip>
            )}
          </Box>
        </Flex>
        <Text fontSize="sm">Location: {location}</Text>
        <Text>Rewards: {rewards}</Text>

        <NextLink
          href={`/${userData?.type}/profile/${creatorCommunityName}`}
          passHref
        >
          <Link
            onClick={(e) => e.stopPropagation()}
            fontSize="sm"
            color="gray.500"
          >
            Evidence Created By {creatorCommunityName}
          </Link>
        </NextLink>
      </Box>
      {showDetails && (
        <Button
          onClick={() =>
            router.push(`/${userData?.type}/evidence/details/${id}`)
          }
          variant="ghost"
        >
          See evidence detail
        </Button>
      )}
    </Box>
  )
}
