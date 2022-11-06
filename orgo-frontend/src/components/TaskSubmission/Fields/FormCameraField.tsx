import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
} from '@chakra-ui/react'
import { isBrowser, isMobile } from 'react-device-detect'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineEdit } from 'react-icons/md'
import { Dispatch, useEffect } from 'react'
import { Camera } from '../../Camera'
import { CameraMobile } from '../../CameraMobile'
import { Field } from '../FieldsMenu'

export interface FormCameraFieldProps {
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
  cameraState: {
    images?: string[]
    setImages?: Dispatch<React.SetStateAction<string[]>>
    urls?: string[]
    setUrls?: Dispatch<React.SetStateAction<string[]>>
  }
}

const FormCameraField: React.FC<FormCameraFieldProps> = ({
  label,
  name,
  helperText,
  index,
  removeFormField,
  editFormField,
  formBuilder,
  cameraState,
  formOptions,
}) => {
  useEffect(() => {
    if (cameraState.images?.length) {
      formOptions.formik?.setFieldValue(label, 'success')
    } else {
      formOptions.formik?.setFieldValue(label, '')
    }
  }, [cameraState.images?.length])

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
              onClick={() => editFormField(Field.CAMERA, index)}
            />
            <RiDeleteBinLine
              cursor="pointer"
              onClick={() => removeFormField(index)}
            />
          </HStack>
        ) : null}
      </FormLabel>

      {isBrowser ? (
        <Camera
          images={cameraState.images}
          setImages={cameraState.setImages}
          urls={cameraState.urls}
          setUrls={cameraState.setUrls}
        />
      ) : null}

      {isMobile ? (
        <CameraMobile
          images={cameraState.images}
          setImages={cameraState.setImages}
          urls={cameraState.urls}
          setUrls={cameraState.setUrls}
        />
      ) : null}

      {helperText && !formOptions?.errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {formOptions?.isTouched && formOptions?.errorMessage && (
        <FormErrorMessage>{formOptions?.errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default FormCameraField
