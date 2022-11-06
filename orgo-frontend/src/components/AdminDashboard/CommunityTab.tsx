import { Box, Text } from '@chakra-ui/react'
import { useGetAllCommunities } from '../../data/hooks/query/useGetAllCommunityAccounts'
import getStrappiUserData from '../../data/utils/strappiUserData'
import ProfileCard from '../ProfileCard'

function AdminDashboardCommunityTab() {
  const strappiUserData = getStrappiUserData()

  const getAllCommunities = useGetAllCommunities(
    strappiUserData.attributes?.type !== 'white_label'
  )

  return (
    <>
      <Text fontSize="lg" fontWeight="bold" mb="6">
        All Communities
      </Text>
      {getAllCommunities.data?.map((community) => (
        <Box key={community._id} mb={5}>
          <ProfileCard
            name={community?.name}
            avatar={community?.logo}
            profileStatus={community?.verified ? 'verified' : 'not verified'}
            type="community"
          />
        </Box>
      ))}
    </>
  )
}

export default AdminDashboardCommunityTab
