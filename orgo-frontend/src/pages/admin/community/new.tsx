import { Box, Text, Button, FormLabel, Alert } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import * as Yup from 'yup'
import Head from 'next/head'
import {
  CustomSelectInput,
  CustomTextAreaInput,
  CustomTextInput,
} from '../../../components/CustomInput'
import getStrappiUserData from '../../../data/utils/strappiUserData'
import { useUploadFile } from '../../../data/hooks/mutations/useUploadFile'
import { useGetLeaderboardData } from '../../../data/hooks/query/useGetAllUsers'
import { useCreateCommunity } from '../../../data/hooks/mutations/useCommunity'
import { useRouter } from 'next/router'

function CreateNewCommunityForm() {
  const strappiUserData = getStrappiUserData()
  const router = useRouter()

  const [files, setFiles] = useState([])

  const createCommunity = useCreateCommunity()
  const getLeaderboardData = useGetLeaderboardData()

  const uploadFile = useUploadFile()
  const { getRootProps, getInputProps } = useDropzone({
    // accept: { 'image/*': [] },
    maxFiles: 1,
    // 5mb
    maxSize: 1024 * 1024 * 5,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      phone: '',
      volunteer: '',
      logo: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Community name is required'),
      volunteer: Yup.string().required('Volunteer is required'),
      phone: Yup.string().min(
        10,
        'Phone number must be at least 10 characters long'
      ),
    }),
    onSubmit: async (value) => {
      let fileUrl = ''
      if (files.length) {
        fileUrl = await uploadFile.mutateAsync(files[0])
      }

      await createCommunity.mutateAsync({
        name: value.name,
        description: value.description,
        phone: value.phone,
        createdBy: value.volunteer,
        logo: fileUrl,
      })

      // formik.resetForm()
      // setFiles([])
      router.push('/admin/dashboard')
    },
  })

  return (
    <Box>
      <Head>
        <title>New Community</title>
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
          mb="5"
          fontSize={{ base: 'lg', lg: 'xl' }}
          fontWeight="bold"
        >
          Create New Community
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              '& > div': {
                mb: 5,
              },
            }}
          >
            <CustomTextInput
              isTouched={formik.touched.name}
              isInvalid={!!formik.errors.name}
              errorMessage={formik.errors.name}
              name="name"
              formik={formik}
              type="text"
              label="Name"
            />

            <CustomTextAreaInput
              isTouched={formik.touched.description}
              isInvalid={!!formik.errors.description}
              errorMessage={formik.errors.description}
              name="description"
              formik={formik}
              type="text"
              label="Description"
            />

            <CustomTextInput
              isTouched={formik.touched.phone}
              isInvalid={!!formik.errors.phone}
              errorMessage={formik.errors.phone}
              name="phone"
              formik={formik}
              type="text"
              label="Phone"
            />

            <CustomSelectInput
              isTouched={formik.touched.volunteer}
              isInvalid={!!formik.errors.volunteer}
              errorMessage={formik.errors.volunteer}
              name="volunteer"
              formik={formik}
              label="Volunteer"
              placeholder="Select a volunteer"
            >
              {getLeaderboardData.data?.users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </CustomSelectInput>

            <FormLabel>Logo</FormLabel>
            {files.length > 0 ? (
              <Alert mb="2">{files.length} File(s) selected</Alert>
            ) : null}
            <Box bg="gray.100" rounded="xl" boxShadow="sm">
              <div {...getRootProps({ className: 'dropzone' })}>
                <input name="image" {...getInputProps()} />
                <Box>
                  <Box
                    border="dashed"
                    py="8"
                    px="5"
                    borderRadius="md"
                    textAlign="center"
                    borderColor="gray.500"
                    cursor="pointer"
                  >
                    <p>Drag 'n' drop or file</p>
                  </Box>
                </Box>
              </div>
            </Box>
          </Box>

          <Button
            type="submit"
            isLoading={uploadFile.isLoading || createCommunity.isLoading}
            colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
            my="2"
            width="full"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default CreateNewCommunityForm
