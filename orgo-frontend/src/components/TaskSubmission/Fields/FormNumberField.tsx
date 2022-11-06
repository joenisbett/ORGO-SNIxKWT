import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineEdit } from 'react-icons/md'
import { Field } from '../FieldsMenu'

export interface FormNumberFieldProps {
  formik?: any
  label: string
  name: string
  helperText?: string
  isTouched?: boolean
  isInvalid?: boolean
  placeholder?: string
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
}

const FormNumberField: React.FC<FormNumberFieldProps> = ({
  label,
  name,
  helperText,
  placeholder,
  index,
  removeFormField,
  editFormField,
  formBuilder,
  formOptions,
}) => {
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
              onClick={() => editFormField(Field.NUMBER, index)}
            />
            <RiDeleteBinLine
              cursor="pointer"
              onClick={() => removeFormField(index)}
            />
          </HStack>
        ) : null}
      </FormLabel>
      <NumberInput
        variant="filled"
        id={name}
        name={name}
        placeholder={placeholder}
      >
        <NumberInputField {...formOptions.formik?.getFieldProps(name)} />
      </NumberInput>
      {helperText && !formOptions?.errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {formOptions?.isTouched && formOptions?.errorMessage && (
        <FormErrorMessage>{formOptions?.errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default FormNumberField
