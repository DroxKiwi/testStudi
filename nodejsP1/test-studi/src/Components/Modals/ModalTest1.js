import React from "react"
import ButtonTest1 from "../Buttons/ButtonTest1"
import '../../Templates/CSS/Modal.css'

const ModalTest1 = (props) => {
    return (
        <div className="Modal">
            <ButtonTest1
                {...props}
            />
        </div>
    )
}

export default ModalTest1