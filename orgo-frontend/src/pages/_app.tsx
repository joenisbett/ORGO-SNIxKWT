import { ChakraProvider, Container } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Layout } from '../components/Layout'
import { theme } from '../theme'
import '../styles/globals.css'
import '@fontsource/poppins'
import { useEffect, useState } from 'react'
import { initGA } from '../data/utils/analytics'
import axios from 'axios'
import { strappiBaseUrl, strappiUserId } from '../data/utils/constants'

export const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  const [strappiUser, setStrappiUser] = useState(false)
  const [serverError, setServerError] = useState(false)

  useEffect(() => {
    initGA(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID)
    const url = `${strappiBaseUrl}/api/super-users/${strappiUserId}?populate=*`

    if (window.location.pathname !== '/server-error') {
      axios
        .get(url)
        .then((data) => {
          localStorage.setItem('strappiUser', JSON.stringify(data.data?.data))
          setStrappiUser(true)
        })
        .catch(() => {
          window.location.href = '/server-error'
        })
    } else {
      axios
        .get(url)
        .then(() => {
          window.location.href = '/'
        })
        .catch(() => {
          setServerError(true)
        })
    }
  }, [])

  return (
    <>
      {strappiUser ? (
        <>
          <QueryClientProvider client={queryClient}>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
            ></link>
            <ReactQueryDevtools initialIsOpen={false} />
            <ChakraProvider theme={theme}>
              {Component.certificatePage ? (
                <Component {...pageProps} />
              ) : Component.landingPage ? (
                <Container>
                  <Component {...pageProps} />
                </Container>
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </ChakraProvider>
          </QueryClientProvider>
        </>
      ) : null}
      {serverError ? <Component {...pageProps} /> : null}
    </>
  )
}

export default MyApp
