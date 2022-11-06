import { Box, Text, Button, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useRegister } from '../data/hooks/mutations/useRegister'
import { useMe, useRedirectToDashboard } from '../data/hooks/useUser'
import {
  CustomTextInput,
  CustomTextInputWithOnBlur,
} from '../components/CustomInput'
import Head from 'next/head'
import { useGetUniqueUsername } from '../data/hooks/mutations/useGetUniqueUsername'

function Register() {
  const getUniqueUsername = useGetUniqueUsername()
  const { isLoading, mutateAsync } = useRegister()
  useRedirectToDashboard()
  const { refetch: refetchProfile } = useMe()
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: '',
      repeatPassword: '',
      email: '',
      firstName: '',
      lastName: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Name is required'),
      lastName: Yup.string().required('Name is required'),
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters long')
        .required('Username is required'),
      password: Yup.string()
        .min(5, 'Password must be at least 5 characters long')
        .required('Password is required'),
      repeatPassword: Yup.string().required('Repeat password is required'),
      email: Yup.string()
        .email('Email is not valid')
        .required('Email is required'),
    }),
    onSubmit: async (
      { email, firstName, lastName, password, repeatPassword, username },
      { setErrors }
    ) => {
      // first check if the passwords match
      if (password !== repeatPassword) {
        return setErrors({
          repeatPassword: 'Passwords do not match',
        })
      }

      if (getUniqueUsername.data === 'Username exists') {
        return
      }

      await mutateAsync({
        email,
        firstName,
        lastName,
        password,
        username,
      })

      refetchProfile()
    },
  })
  return (
    <Box>
      <Head>
        <title>Register</title>
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
          fontSize={{ base: 'lg', lg: '2xl' }}
          my="10px"
          fontWeight="bold"
        >
          Create an Account
        </Text>
        <form onSubmit={formik.handleSubmit}>
          <CustomTextInput
            isTouched={formik.touched.firstName}
            isInvalid={!!formik.errors.firstName}
            errorMessage={formik.errors.firstName}
            name="firstName"
            formik={formik}
            label="First Name"
          />
          <CustomTextInput
            isTouched={formik.touched.lastName}
            isInvalid={!!formik.errors.lastName}
            errorMessage={formik.errors.lastName}
            name="lastName"
            formik={formik}
            label="Last Name"
          />
          <CustomTextInputWithOnBlur
            isTouched={formik.touched.username}
            isInvalid={
              !!formik.errors.username ||
              getUniqueUsername.data === 'Username exists'
            }
            errorMessage={formik.errors.username ?? 'Username is not available'}
            name="username"
            formik={formik}
            label="Username"
            helperText="This needs to be unique"
            onBlur={(e) => {
              formik.handleBlur(e)
              if (e.target.value) {
                getUniqueUsername.mutate(e.target.value)
              }
            }}
          />
          <CustomTextInput
            isTouched={formik.touched.email}
            isInvalid={!!formik.errors.email}
            errorMessage={formik.errors.email}
            name="email"
            type="email"
            formik={formik}
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
          <CustomTextInput
            isTouched={formik.touched.repeatPassword}
            isInvalid={!!formik.errors.repeatPassword}
            errorMessage={formik.errors.repeatPassword}
            name="repeatPassword"
            formik={formik}
            label="Repeat Password"
            type="password"
          />
          <Button
            isLoading={isLoading}
            type="submit"
            alignSelf="self-start"
            my="2"
          >
            Create Account
          </Button>
        </form>
        <NextLink href="/login" passHref>
          <Link fontWeight="semibold" my="4">
            <Text
              my="2"
              mx="1"
              fontWeight="semibold"
              fontSize={{ base: 'sm', lg: '2xl' }}
            >
              Already have an account? Log in
            </Text>
          </Link>
        </NextLink>
      </Box>
    </Box>
  )
}

export default Register
