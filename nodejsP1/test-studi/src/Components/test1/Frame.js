import React from 'react'
import Btn1 from './Btn1'
import Input from './Input'
import { useState } from 'react'

export default function Frame() {

  const [value, setValue] = useState("")

  return (
    <div>
      <Btn1 
        id="btnTest"
        content={value}
      />
      <Input 
        id="inputTest"
        onC={setValue}
      />
    </div>
  )
}
