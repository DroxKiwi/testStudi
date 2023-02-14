import React from 'react'
import { useState } from 'react'

export default function Btn1({content}) {

    const [inner, setInner] = useState("default value")
    return (
        <div>
            <button 
                onClick={() => {
                    setInner(content)
                }}
            >
                {inner}
            </button>
        </div>
    )
}
