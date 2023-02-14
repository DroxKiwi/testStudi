import React from 'react'

export default function Input({id, onC}) {
  return (
    <div>
      <input 
        type="text"
        placeholder="enter something"
        id={id}
        onChange={e => onC(e.target.value)}
      >
          
      </input>
    </div>
  )
}
