import {
  Avatar,
  Box,
  Fade,
  Spinner,
  Text,
  useDisclosure,
  useUpdateEffect,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface SearchResultsProps {
  searchCommunitiesData: any
  isSearchCommunitiesLoading: boolean
  isSearchCommunitiesError: boolean
  isSearchCommunitiesSuccess: boolean
  debouncedSearchTerm: string
}

const SearchResults = ({
  searchCommunitiesData,
  isSearchCommunitiesLoading,
  isSearchCommunitiesError,
  isSearchCommunitiesSuccess,
  debouncedSearchTerm,
}: SearchResultsProps) => {
  const router = useRouter()
  const { isOpen, onClose, onOpen } = useDisclosure()

  useUpdateEffect(() => {
    if (debouncedSearchTerm) {
      onOpen()
    } else {
      onClose()
    }
  }, [debouncedSearchTerm])

  return (
    <Fade in={isOpen}>
      <Box
        sx={{
          mt: 1,
        }}
        bgColor="white"
        borderRadius="md"
      >
        {isSearchCommunitiesLoading && debouncedSearchTerm ? (
          <Box textAlign="center" py={4}>
            <Spinner />
          </Box>
        ) : null}
        {isSearchCommunitiesError ? (
          <Text align="center" py={4}>
            Something went wrong.
          </Text>
        ) : null}
        {isSearchCommunitiesSuccess ? (
          <>
            {searchCommunitiesData?.length ? (
              searchCommunitiesData?.slice(0, 5)?.map((community) => (
                <Box
                  key={community._id}
                  px={3}
                  py={2}
                  display="flex"
                  alignItems="center"
                  cursor="pointer"
                  sx={{
                    '&:hover': {
                      bg: 'gray.100',
                    },
                  }}
                  onClick={() => {
                    router.push(`/community/profile/${community.name}`)
                  }}
                >
                  <Avatar
                    size="md"
                    name={community.name}
                    src={community.logo}
                  />
                  <Box ml={3}>
                    <Text fontWeight="bold">{community.name}</Text>
                    <Text fontSize="sm">{community.city}</Text>
                  </Box>
                </Box>
              ))
            ) : (
              <Text align="center" py={4}>
                No results found.
              </Text>
            )}
          </>
        ) : null}
      </Box>
    </Fade>
  )
}

export default SearchResults
