import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdOutlineEdit } from 'react-icons/md'
import { Field } from '../FieldsMenu'

export interface FormMultiChoiceFieldProps {
  label: string
  name: string
  helperText?: string
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

const FormMultiChoiceField: React.FC<FormMultiChoiceFieldProps> = ({
  label,
  name,
  helperText,
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
              onClick={() => editFormField(Field.MULTI_CHOICE, index)}
            />
            <RiDeleteBinLine
              cursor="pointer"
              onClick={() => removeFormField(index)}
            />
          </HStack>
        ) : null}
      </FormLabel>
      <RadioGroup defaultValue="1">
        <Stack>
          {options.map((option, index) => (
            <Radio
              {...formOptions.formik?.getFieldProps(name)}
              key={option + index}
              value={option || 'n/a'}
              sx={{
                borderColor: 'gray.300',
              }}
            >
              {option || 'n/a'}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      {helperText && !formOptions?.errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {formOptions?.isTouched && formOptions?.errorMessage && (
        <FormErrorMessage>{formOptions?.errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default FormMultiChoiceField
