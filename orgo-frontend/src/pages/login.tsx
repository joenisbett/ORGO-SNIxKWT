import { Box, Text, Button, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useLogin } from '../data/hooks/mutations/useLogin'
import { useMe, useRedirectToDashboard } from '../data/hooks/useUser'
import { CustomTextInput } from '../components/CustomInput'
import Head from 'next/head'

function Login() {
  const { isLoading, mutateAsync } = useLogin()
  useRedirectToDashboard()
  const { refetch: refetchProfile } = useMe()
  const formik = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(5, 'Password must be at least 5 characters long')
        .required('Password is required'),
      email: Yup.string()
        .email('Email is not valid')
        .required('Email is required'),
    }),
    onSubmit: async (value) => {
      await mutateAsync(value)
      refetchProfile()
    },
  })
  return (
    <Box>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        bg="gray.300"
        alignItems="center"
        borderRadius="10px"
        mt="40px"
        mb="20px"
        p={{ base: '10px', sm: '15px', md: '30px' }}
        flexDirection="column"
      >
        <Text
          alignSelf="self-start"
          my="10px"
          fontSize={{ base: 'lg', lg: '2xl' }}
          fontWeight="bold"
        >
          Login
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <CustomTextInput
            isTouched={formik.touched.email}
            isInvalid={!!formik.errors.email}
            errorMessage={formik.errors.email}
            name="email"
            formik={formik}
            type="email"
            label="Email Address"
          />

          <CustomTextInput
            isTouched={formik.touched.password}
            isInvalid={!!formik.errors.password}
            errorMessage={formik.errors.password}
            type="password"
            name="password"
            formik={formik}
            label="Password"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            alignSelf="self-start"
            my="2"
          >
            Login
          </Button>
        </form>

        <NextLink href="/register" passHref>
          <Link fontWeight="semibold" my="4">
            <Text
              my="2"
              mx="1"
              fontWeight="semibold"
              fontSize={{ base: 'sm', lg: '2xl' }}
            >
              Don't have an account yet ? Sign up
            </Text>
          </Link>
        </NextLink>
      </Box>
    </Box>
  )
}

export default Login
