import React from "react"
import PropTypes from 'prop-types'

const ButtonTest1 = ({label, handleClick, backgroundColor, color }) => {
    return (
        <button
            type="button"
            style={{backgroundColor, color}}
            onClick={handleClick}
        >
            {label}
        </button>
    )
}

ButtonTest1.propTypes = {
    label: PropTypes.string
}

export default ButtonTest1