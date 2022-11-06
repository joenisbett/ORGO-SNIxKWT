import { MenuDivider, MenuItem, MenuList } from '@chakra-ui/react'
import { AiOutlineNumber } from 'react-icons/ai'
import { BiCaretDownSquare } from 'react-icons/bi'
import {
  MdTextFormat,
  MdTextFields,
  MdDateRange,
  MdUploadFile,
  MdOutlineStopCircle,
  MdOutlineCheckBox,
  MdOutlineCameraAlt,
} from 'react-icons/md'

export enum Field {
  TEXT = 'text',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  DATE = 'date',
  FILE_UPLOAD = 'file upload',
  MULTI_CHOICE = 'multi choice',
  CHECKBOXES = 'checkboxes',
  DROPDOWN = 'dropdown',
  CAMERA = 'camera',
}

interface FieldsMenuProps {
  onDrawerOpen: () => void
  drawerTypeRef: any
  fieldTypeRef: any
}

const FieldsMenu = ({
  onDrawerOpen,
  drawerTypeRef,
  fieldTypeRef,
}: FieldsMenuProps) => {
  const handleMenuItemClick = (field: Field) => {
    onDrawerOpen()
    drawerTypeRef.current = 'Add'

    fieldTypeRef.current = field
  }

  return (
    <MenuList zIndex={50}>
      <MenuItem
        onClick={() => handleMenuItemClick(Field.TEXT)}
        icon={<MdTextFormat fontSize="20" />}
      >
        Text Input
      </MenuItem>
      <MenuItem
        onClick={() => handleMenuItemClick(Field.NUMBER)}
        icon={<AiOutlineNumber fontSize="20" />}
      >
        Number Input
      </MenuItem>
      <MenuItem
        onClick={() => handleMenuItemClick(Field.TEXTAREA)}
        icon={<MdTextFields fontSize="20" />}
      >
        Multi-line Input
      </MenuItem>
      <MenuDivider />
      <MenuItem
        onClick={() => handleMenuItemClick(Field.DATE)}
        icon={<MdDateRange fontSize="20" />}
      >
        Date
      </MenuItem>
      <MenuItem
        onClick={() => handleMenuItemClick(Field.FILE_UPLOAD)}
        icon={<MdUploadFile fontSize="20" />}
      >
        File Upload
      </MenuItem>
      <MenuDivider />
      <MenuItem
        onClick={() => handleMenuItemClick(Field.MULTI_CHOICE)}
        icon={<MdOutlineStopCircle fontSize="20" />}
      >
        Multi choice
      </MenuItem>
      <MenuItem
        onClick={() => handleMenuItemClick(Field.CHECKBOXES)}
        icon={<MdOutlineCheckBox fontSize="20" />}
      >
        Checkboxes
      </MenuItem>
      <MenuItem
        onClick={() => handleMenuItemClick(Field.DROPDOWN)}
        icon={<BiCaretDownSquare fontSize="20" />}
      >
        Dropdown
      </MenuItem>
      <MenuDivider />
      <MenuItem
        onClick={() => handleMenuItemClick(Field.CAMERA)}
        icon={<MdOutlineCameraAlt fontSize="20" />}
      >
        Camera
      </MenuItem>
    </MenuList>
  )
}

export default FieldsMenu
