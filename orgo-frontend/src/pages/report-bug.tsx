import { Alert, Box, Button, FormLabel, Text } from '@chakra-ui/react'
import { useFormik } from 'formik'
import Head from 'next/head'
import { CustomTextAreaInput, CustomTextInput } from '../components/CustomInput'
import * as Yup from 'yup'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { useCreateClickUpTask } from '../data/hooks/mutations/useBugReport'
import { useUploadFile } from '../data/hooks/mutations/useUploadFile'

const ReportBug = () => {
  const [files, setFiles] = useState([])

  const uploadFile = useUploadFile()
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    // accept: { 'image/*': [], 'application/pdf': ['.pdf'] },
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

  const createClickUpTask = useCreateClickUpTask(() => {
    formik.resetForm()
    setFiles([])
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, 'Title must be at least 5 characters long')
        .required('Title is required'),
      description: Yup.string()
        .min(10, 'Description must be at least 10 characters long')
        .required('Description is required'),
    }),
    onSubmit: async (value) => {
      if (files.length > 0) {
        const fileUrl = await uploadFile.mutateAsync(files[0])

        createClickUpTask.mutate({
          name: value.title,
          description: value.description + `\n${fileUrl}`,
        })
      } else {
        createClickUpTask.mutate({
          name: value.title,
          description: value.description,
        })
      }
    },
  })

  return (
    <>
      <Head>
        <title>Report Bug</title>
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
          mb="10px"
          fontSize={{ base: 'lg', lg: '2xl' }}
          fontWeight="bold"
          display="flex"
          justifyContent="center"
        >
          Report a bug
        </Text>

        {fileRejections.length > 0 && (
          <Alert>Please upload valid image files only</Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <CustomTextInput
            isTouched={formik.touched.title}
            isInvalid={!!formik.errors.title}
            errorMessage={formik.errors.title}
            name="title"
            formik={formik}
            type="text"
            label="Title"
          />

          <CustomTextAreaInput
            isTouched={formik.touched.description}
            isInvalid={!!formik.errors.description}
            errorMessage={formik.errors.description}
            name="description"
            formik={formik}
            label="Description"
          />

          <FormLabel>Attachments</FormLabel>
          {files.length > 0 ? <Alert mb="2">1 File uploaded</Alert> : null}
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
                  <p>Drag 'n' drop or browse files</p>
                  <p>(Max files: 1)</p>
                </Box>
              </Box>
            </div>
          </Box>

          <Button
            type="submit"
            isLoading={uploadFile.isLoading || createClickUpTask.isLoading}
            alignSelf="self-start"
            my="2"
            w="100%"
            mt="5"
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  )
}

export default ReportBug
