import React from 'react'
import Input from './Input/Input'
// import Textarea from './Textarea'
//import Select from './Select'
import RadioButtons from './RadioButton/RadioButton'
import CheckboxGroup from './CheckboxGroup/CheckboxGroup'
//import DatePicker from './DatePicker'
//import ChakraInput from './ChakraInput'
import Image from "./FormImage/Image"

function FormikControls (props) {
  const { control, ...rest } = props
  switch (control) {
    case 'input':
      return <Input {...rest} />
    // case 'textarea':
    //   return <Textarea {...rest} />
    // case 'select':
    //   return <Select {...rest} />
    case 'radio':
      return <RadioButtons {...rest} />
    case 'checkbox':
      return <CheckboxGroup {...rest} />
    // case 'date':
    //   return <DatePicker {...rest} />
    // case 'chakraInput':
    //   return <ChakraInput {...rest} />
    default:
      return null
  }
}

export default FormikControls