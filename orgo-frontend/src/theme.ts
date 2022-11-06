import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  styles: {
    global: {
      'ol,ul': {
        marginLeft: '1rem',
        padding: '0',
      },
      h1: {
        fontSize: '30px',
        fontWeight: 'bold',
        lineHeight: '110%',
        letterSpacing: '-2%',
      },
      h2: {
        fontSize: '20px',
        fontWeight: 'semibold',
        lineHeight: '110%',
        letterSpacing: '-1%',
      },
    },
  },
  fonts: {
    heading: 'poppins, sans-serif',
    body: 'poppins, sans-serif',
  },
})
