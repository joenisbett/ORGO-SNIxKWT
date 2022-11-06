import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Select,
} from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineEdit } from 'react-icons/md'
import { Field } from '../FieldsMenu'

export interface FormSelectFieldProps {
  label: string
  name: string
  helperText?: string
  placeholder?: string
  index: number
  options: string[]
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

const FormSelectField: React.FC<FormSelectFieldProps> = ({
  label,
  name,
  helperText,
  placeholder,
  index,
  removeFormField,
  options,
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
              onClick={() => editFormField(Field.DROPDOWN, index)}
            />
            <RiDeleteBinLine
              cursor="pointer"
              onClick={() => removeFormField(index)}
            />
          </HStack>
        ) : null}
      </FormLabel>
      <Select
        {...formOptions.formik?.getFieldProps(name)}
        variant="filled"
        id={name}
        name={name}
        placeholder={placeholder}
      >
        {options.map((option, index) => (
          <option key={option + index} value={option || 'n/a'}>
            {option || 'n/a'}
          </option>
        ))}
      </Select>
      {helperText && !formOptions?.errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {formOptions?.isTouched && formOptions?.errorMessage && (
        <FormErrorMessage>{formOptions?.errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default FormSelectField
