import { Dispatch, useEffect } from 'react'
import {
  Alert,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  FormErrorMessage,
  Image,
} from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineEdit } from 'react-icons/md'
import { useDropzone } from 'react-dropzone'
import { Field } from '../FieldsMenu'
import { GrDocumentPdf } from 'react-icons/gr'

export interface FormFileUploadFieldProps {
  label: string
  name: string
  helperText?: string
  index: number
  removeFormField?: (index: number) => void
  editFormField?: (fieldType: string, index: number) => void
  formBuilder: boolean
  formOptions: {
    formik?: any
    isTouched?: boolean
    isInvalid?: boolean
    errorMessage?: string
  }
  fileUploadState: {
    files?: any[]
    setFiles?: Dispatch<React.SetStateAction<any[]>>
  }
  howMany: number
  isRequired: boolean
}

const FormFileUploadField: React.FC<FormFileUploadFieldProps> = ({
  label,
  name,
  helperText,
  index,
  removeFormField,
  editFormField,
  formBuilder,
  formOptions,
  fileUploadState,
  howMany,
  isRequired,
}) => {
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    // accept: {
    //   'image/*': [],
    //   'application/pdf': ['.pdf'],
    // },
    maxFiles: howMany,
    // 5mb
    maxSize: 1024 * 1024 * 5,
    onDrop: (acceptedFiles) => {
      fileUploadState.setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  useEffect(() => {
    if (howMany === fileUploadState.files?.length) {
      formOptions.formik?.setFieldValue(label, 'success')
    } else {
      formOptions.formik?.setFieldValue(label, '')
    }
  }, [fileUploadState.files?.length])

  return (
    <FormControl
      isInvalid={formOptions.isInvalid && formOptions.isTouched}
      mb="5"
      sx={{
        '&:hover > label > div': {
          display: 'flex',
        },
      }}
    >
      <FormLabel
        htmlFor={name}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ cursor: formBuilder ? 'move' : 'default' }}>
          {label}
        </span>
        {formBuilder ? (
          <HStack display="none">
            <MdOutlineEdit
              cursor="pointer"
              onClick={() => editFormField(Field.FILE_UPLOAD, index)}
            />
            <RiDeleteBinLine
              cursor="pointer"
              onClick={() => removeFormField(index)}
            />
          </HStack>
        ) : null}
      </FormLabel>

      {fileRejections.length > 0 && (
        <Alert borderRadius="md" mb="2" colorScheme="red">
          Limit is {howMany} file(s) and 5MB.
        </Alert>
      )}
      {isRequired &&
        fileUploadState.files?.length > 0 &&
        howMany !== fileUploadState.files?.length && (
          <Alert borderRadius="md" mb="2" colorScheme="red">
            You've to upload {howMany} files to proceed
          </Alert>
        )}
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {console.log(fileUploadState.files)}
        {fileUploadState.files?.length > 0 &&
          fileUploadState.files?.map((file) => (
            <>
              {file?.type === 'application/pdf' ? (
                <Box
                  key={file.name + file.size}
                  mb="2"
                  mr="2"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100px"
                  width="100px"
                >
                  <GrDocumentPdf fontSize={30} />
                </Box>
              ) : (
                <Image
                  key={file.name + file.size}
                  mb="2"
                  mr="2"
                  alt={file?.name}
                  alignSelf="center"
                  src={file?.preview}
                  height="100px"
                  width="100px"
                />
              )}
            </>
          ))}
      </Box>
      <Box bg="gray.100" rounded="xl" boxShadow="sm">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input name="image" {...getInputProps()} />
          <Box
            border="dashed"
            py="8"
            px="5"
            borderRadius="md"
            textAlign="center"
            borderColor="gray.500"
            cursor="pointer"
          >
            Drag 'n' drop or browse files
          </Box>
        </div>
      </Box>

      {helperText && !formOptions?.errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {formOptions?.isTouched && formOptions?.errorMessage && (
        <FormErrorMessage>{formOptions?.errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default FormFileUploadField
