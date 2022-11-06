import { Box, IconButton, Skeleton, Text } from '@chakra-ui/react'
import { CSVLink } from 'react-csv'
import { BsDownload } from 'react-icons/bs'
import { useGetAllUsers } from '../../data/hooks/query/useGetAllUsers'
import ProfileCard from '../ProfileCard'

function AdminDashboardVolunteerTab() {
  const getAllUsers = useGetAllUsers()

  const userDataInCSV =
    getAllUsers.data?.map((user) => [user.name, user.email]) || []

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 6,
        }}
      >
        <Text fontSize="lg" fontWeight="bold">
          All Volunteers
        </Text>
        <CSVLink
          filename="user-data.csv"
          data={[['Name', 'Email'], ...userDataInCSV]}
        >
          <IconButton
            aria-label="Export Email List"
            size="sm"
            icon={<BsDownload size={17} />}
          />
        </CSVLink>
      </Box>
      {getAllUsers.isLoading
        ? [1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} mb="5" height={65} />
          ))
        : getAllUsers.data?.map((user) => (
            <Box key={user?._id} mb={5}>
              <ProfileCard
                name={user?.name}
                avatar={user?.avatar}
                profileStatus={user?.verified ? 'verified' : 'not verified'}
                type="volunteer"
                username={user?.username}
              />
            </Box>
          ))}
    </>
  )
}

export default AdminDashboardVolunteerTab
