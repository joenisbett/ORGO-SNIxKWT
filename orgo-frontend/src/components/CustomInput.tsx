import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Textarea,
  Select,
  InputGroup,
  InputRightElement,
  Checkbox,
} from '@chakra-ui/react'
import { IoLocationSharp } from 'react-icons/io5'

export interface CustomInputProps {
  name: string
  label: string
  formik: any
  helperText?: string
  type?: string
  isTouched?: boolean
  isInvalid?: boolean
  errorMessage?: string
  placeholder?: string
  handleClick?: () => void
  value?: any
  onBlur?: any
  disabled?: boolean
}

export const CustomTextInput: React.FC<CustomInputProps> = ({
  formik,
  label,
  name,
  helperText,
  type = 'text',
  isTouched,
  isInvalid,
  errorMessage,
  placeholder,
  disabled = false,
}) => {
  return (
    <FormControl isInvalid={isInvalid && isTouched} my="3">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        {...formik.getFieldProps(name)}
        variant="filled"
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
      />
      {helperText && !errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {isTouched && errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export const CustomTextInputWithOnBlur: React.FC<CustomInputProps> = ({
  formik,
  label,
  name,
  helperText,
  type = 'text',
  isTouched,
  isInvalid,
  errorMessage,
  placeholder,
  onBlur,
  disabled = false,
}) => {
  return (
    <FormControl isInvalid={isInvalid && isTouched} my="3">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        {...formik.getFieldProps(name)}
        variant="filled"
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        onBlur={onBlur}
        disabled={disabled}
      />
      {helperText && !errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {isTouched && errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export const CustomTextAreaInput: React.FC<CustomInputProps> = ({
  formik,
  label,
  name,
  helperText,
  isTouched,
  isInvalid,
  errorMessage,
  placeholder,
  disabled = false,
}) => {
  return (
    <FormControl isInvalid={isInvalid && isTouched} my="3">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
        variant="filled"
        id={name}
        name={name}
        disabled={disabled}
      />
      {helperText && !errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {isTouched && errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export const CustomSelectInput: React.FC<CustomInputProps> = ({
  formik,
  label,
  name,
  helperText,
  isTouched,
  isInvalid,
  errorMessage,
  children,
  disabled = false,
  placeholder = '',
}) => {
  return (
    <FormControl isInvalid={isInvalid && isTouched} my="6">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        {...formik.getFieldProps(name)}
        variant="filled"
        id={name}
        name={name}
        placeholder={placeholder || 'Select an option'}
        disabled={disabled}
      >
        {children}
      </Select>
      {helperText && !errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {isTouched && errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export const CustomMapInput: React.FC<CustomInputProps> = ({
  formik,
  label,
  name,
  helperText,
  type = 'text',
  isTouched,
  isInvalid,
  errorMessage,
  placeholder,
  handleClick,
  value,
  disabled = false,
}) => {
  return (
    <FormControl isInvalid={isInvalid && isTouched} my="3">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <InputGroup cursor="pointer" onClick={handleClick}>
        <Input
          {...formik.getFieldProps(name)}
          variant="filled"
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          cursor="pointer"
          readOnly
          value={value}
          disabled={disabled}
        />
        <InputRightElement>
          <IoLocationSharp size={23} />
        </InputRightElement>
      </InputGroup>
      {helperText && !errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {isTouched && errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export const CustomCheckboxInput: React.FC<CustomInputProps> = ({
  formik,
  label,
  name,
  helperText,
  isTouched,
  isInvalid,
  errorMessage,
  disabled = false,
}) => {
  return (
    <FormControl isInvalid={isInvalid && isTouched} my="3">
      <Checkbox
        {...formik.getFieldProps(name)}
        name={name}
        isChecked={formik.values[name]}
        disabled={disabled}
      >
        {label}
      </Checkbox>
      {helperText && !errorMessage && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {isTouched && errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}
