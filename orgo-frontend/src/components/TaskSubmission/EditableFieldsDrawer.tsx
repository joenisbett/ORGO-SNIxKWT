import { Dispatch, SetStateAction, useRef, useState } from 'react'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useUpdateEffect,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi'
import { CustomCheckboxInput, CustomTextInput } from '../CustomInput'
import { Field } from './FieldsMenu'
import { FieldItem } from './CreateTaskSubmission'
import getStrappiUserData from '../../data/utils/strappiUserData'

export type DrawerType = 'Add' | 'Edit'
interface EditableFieldsDrawerProps {
  isOpen: boolean
  onClose: () => void
  drawerType: DrawerType
  fieldType: string
  formFields: FieldItem[]
  setFormFields: Dispatch<SetStateAction<any[]>>
  editFieldIndex: number | undefined
  setEditFieldIndex: Dispatch<SetStateAction<number | undefined>>
}

const EditableFieldsDrawer = ({
  isOpen,
  onClose,
  drawerType,
  fieldType,
  formFields,
  setFormFields,
  editFieldIndex,
  setEditFieldIndex,
}: EditableFieldsDrawerProps) => {
  const strappiUserData = getStrappiUserData()

  const firstField = useRef()

  const [options, setOptions] = useState<string[]>([''])
  const [optionsData, setOptionsData] = useState<string[]>([''])

  const formik = useFormik({
    initialValues: {
      label: '',
      placeholder: '',
      helperText: '',
      isRequired: false,
      howMany: 1,
    },
    validationSchema: Yup.object({
      // name: Yup.string()
      //   .min(3, 'task name must be at least 3 characters long')
      //   .required('Please enter a task name.'),
      label: Yup.string().required('Please enter a label.'),
    }),
    onSubmit: (value) => {
      // console.log('value', value)
      if (drawerType === 'Add') {
        setFormFields((prevValue) => [
          ...prevValue,
          {
            ...value,
            type: fieldType,
            options: optionsData,
          },
        ])
      } else {
        setFormFields((prevValue) => {
          const newValue = [...prevValue]
          newValue[editFieldIndex] = {
            ...newValue[editFieldIndex],
            ...value,
            options: optionsData,
          }

          return newValue
        })
      }

      setTimeout(() => {
        onClose()
      }, 100)
    },
  })

  // reset form after drawer is closed
  useUpdateEffect(() => {
    if (!isOpen) {
      formik.resetForm()
      setOptions([''])
      setOptionsData([''])
      setEditFieldIndex(undefined)
    }
  }, [isOpen])

  // update fields if edit icon is clicked
  useUpdateEffect(() => {
    if (typeof editFieldIndex === 'number') {
      // console.log('formFields', formFields)
      formik.setValues({
        label: formFields[editFieldIndex].label,
        placeholder: formFields[editFieldIndex].placeholder,
        helperText: formFields[editFieldIndex].helperText,
        isRequired: formFields[editFieldIndex].isRequired,
        howMany: formFields[editFieldIndex].howMany,
      })
      setOptions(formFields[editFieldIndex].options)
      setOptionsData(formFields[editFieldIndex].options)
    }
  }, [editFieldIndex])

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={onClose}
      size="sm"
    >
      <form onSubmit={formik.handleSubmit}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {drawerType} field
          </DrawerHeader>

          <DrawerBody>
            <Stack>
              <CustomTextInput
                isTouched={formik.touched.label}
                isInvalid={!!formik.errors.label}
                errorMessage={formik.errors.label}
                name="label"
                formik={formik}
                label="Label"
              />

              <CustomTextInput
                isTouched={formik.touched.helperText}
                isInvalid={!!formik.errors.helperText}
                errorMessage={formik.errors.helperText}
                name="helperText"
                formik={formik}
                label="HelperText"
              />

              {fieldType === Field.TEXT ||
              fieldType === Field.NUMBER ||
              fieldType === Field.TEXTAREA ||
              fieldType === Field.DROPDOWN ? (
                <CustomTextInput
                  isTouched={formik.touched.placeholder}
                  isInvalid={!!formik.errors.placeholder}
                  errorMessage={formik.errors.placeholder}
                  name="placeholder"
                  formik={formik}
                  label="Placeholder"
                />
              ) : null}

              <CustomCheckboxInput
                isTouched={formik.touched.isRequired}
                isInvalid={!!formik.errors.isRequired}
                errorMessage={formik.errors.isRequired}
                name="isRequired"
                formik={formik}
                label="Required"
              />

              {fieldType === Field.FILE_UPLOAD && formik.values.isRequired ? (
                <CustomTextInput
                  type="number"
                  isTouched={formik.touched.howMany}
                  isInvalid={!!formik.errors.howMany}
                  errorMessage={formik.errors.howMany}
                  name="howMany"
                  formik={formik}
                  label="How Many?"
                />
              ) : null}

              {fieldType === Field.DROPDOWN ||
              fieldType === Field.CHECKBOXES ||
              fieldType === Field.MULTI_CHOICE ? (
                <FormControl my="3">
                  <FormLabel htmlFor="option">Options</FormLabel>
                  <Stack spacing={3}>
                    {options.map((option, index) => (
                      <Box
                        key={option + index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Input
                          size="sm"
                          id="option"
                          onChange={(e) => {
                            const inputValue = e.target.value

                            setOptionsData((prevValue) => {
                              const newValue = [...prevValue]
                              newValue[index] = inputValue
                              return newValue
                            })
                          }}
                          value={optionsData[index]}
                        />
                        <FiPlusCircle
                          fontSize={23}
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            visibility:
                              index === options.length - 1
                                ? 'visible'
                                : 'hidden',
                          }}
                          cursor="pointer"
                          onClick={() => {
                            setOptions((prevValue) => [...prevValue, ''])
                            setOptionsData((prevValue) => [...prevValue, ''])
                          }}
                        />
                        <FiMinusCircle
                          fontSize={23}
                          cursor="pointer"
                          style={{
                            visibility:
                              index === options.length - 1
                                ? 'visible'
                                : 'hidden',
                          }}
                          onClick={() => {
                            if (options.length === 1) {
                              return
                            }

                            const newOptions = [...options]
                            const newOptionsData = [...optionsData]
                            newOptions.pop()
                            newOptionsData.pop()
                            setOptions(newOptions)
                            setOptionsData(newOptionsData)
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </FormControl>
              ) : null}
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
              type="submit"
            >
              {drawerType}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  )
}

export default EditableFieldsDrawer
