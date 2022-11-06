import { useState } from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import { MdLeaderboard } from 'react-icons/md'
import { useRouter } from 'next/router'
import {
  Box,
  InputGroup,
  Input,
  InputRightAddon,
  useMediaQuery,
  useUpdateEffect,
  IconButton,
} from '@chakra-ui/react'
import Head from 'next/head'
import { MapView } from '../components/Map/Map'
import { useGetCommunityLocations } from '../data/hooks/query/useGetMapLocation'
import SearchResults from '../components/SearchResults'
import { useDebounce } from '../data/hooks/useDebounce'
import { useSearchCommunities } from '../data/hooks/mutations/useCommunity'
import { EventCategory, logEvent } from '../data/utils/analytics'
import getStrappiUserData from '../data/utils/strappiUserData'

function Explore() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLargerThan500] = useMediaQuery('(min-width: 500px)')
  const strappiUserData = getStrappiUserData()

  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const getCommunityLocations = useGetCommunityLocations()
  const searchCommunities = useSearchCommunities(() => undefined)

  useUpdateEffect(() => {
    searchCommunities.mutate({ searchTerm: debouncedSearchTerm })
    logEvent(EventCategory.MAP, `Searched for a community`)
  }, [debouncedSearchTerm])

  if (strappiUserData.attributes?.type === 'white_label') {
    window.location.href = '/404'
    return
  }

  return (
    <Box position="relative">
      <Head>
        <title>Explore - Community and User profiles</title>
      </Head>
      <InputGroup
        position="absolute"
        display="flex"
        flexDirection="column"
        top={5}
        zIndex="10"
        px={isLargerThan500 ? '10' : '5'}
      >
        <Box display="flex" alignItems="center">
          <Box display="flex" mr="2" width="100%">
            <Input
              bgColor="white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Enter username..."
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              width="100%"
            />
            <InputRightAddon
              cursor="pointer"
              onClick={() => {
                if (debouncedSearchTerm) {
                  searchCommunities.mutate({ searchTerm: debouncedSearchTerm })
                }
              }}
            >
              <SearchIcon />
            </InputRightAddon>
          </Box>
          <IconButton
            aria-label="Leaderboard"
            icon={<MdLeaderboard style={{ fontSize: '20px' }} />}
            variant="solid"
            size="sm"
            onClick={() => router.push('/leaderboard')}
          />
        </Box>
        <SearchResults
          searchCommunitiesData={searchCommunities.data}
          isSearchCommunitiesLoading={searchCommunities.isLoading}
          isSearchCommunitiesError={searchCommunities.isError}
          isSearchCommunitiesSuccess={searchCommunities.isSuccess}
          debouncedSearchTerm={debouncedSearchTerm}
        />
      </InputGroup>

      <Box sx={{ h: '100vh', w: '100%' }}>
        <MapView location={getCommunityLocations.data} zoomLevel={10} />
      </Box>
    </Box>
  )
}

export default Explore
