import React from 'react'
import ButtonS from './ButtonS'
import ButtonSOVR from './ButtonSOVR'

export default function Frame() {
  return (
    <div>
        <ButtonS isLight={true} />
        <ButtonS isLight={false} />
        <ButtonSOVR />
    </div>
  )
}
