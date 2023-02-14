import React from "react"
import { useState } from "react"

const ButtonTest = () => {
    const [count, setCount] = useState(0)
    const handleClick = () => {
        setCount(count + 1)
    }
    return (
        <>
        <p>compteur : {count}</p>
        <button type="button" onClick={handleClick}>Test button</button>
        </>
    )
}

export default ButtonTest