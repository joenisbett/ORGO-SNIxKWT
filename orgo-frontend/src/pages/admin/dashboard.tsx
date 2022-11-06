import Head from 'next/head'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import getStrappiUserData from '../../data/utils/strappiUserData'
import AdminDashboardVolunteerTab from '../../components/AdminDashboard/VolunteerTab'
import AdminDashboardCommunityTab from '../../components/AdminDashboard/CommunityTab'

function AdminDashboard() {
  const strappiUserData = getStrappiUserData()

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box>
        <Tabs isFitted variant="enclosed-colored">
          <TabList mb="2">
            <Tab
              _selected={{
                color: 'white',
                bg: `${strappiUserData.attributes?.brand_color || 'blue'}.500`,
              }}
            >
              Volunteer
            </Tab>
            <Tab
              _selected={{
                color: 'white',
                bg: `${strappiUserData.attributes?.brand_color || 'blue'}.500`,
              }}
            >
              Community
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AdminDashboardVolunteerTab />
            </TabPanel>
            <TabPanel>
              <AdminDashboardCommunityTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}

export default AdminDashboard
