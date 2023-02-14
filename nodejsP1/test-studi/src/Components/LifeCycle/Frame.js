import React from 'react'
import Clock from './Clock'
import Counter from './Counter'
import { useState } from 'react'
import SeekAndDestroy from './SeekAndDestroy'

export default function Frame() {
    const [show, setShow] = useState(true);

    const handleClick = () => {
      setShow(false);
    };
    return (
        <div>
            <Clock />
            <Counter />
            <div>
                {show && <SeekAndDestroy />}
                <button
                    type="button"
                    onClick={handleClick}
                >
                    Click to destroy
                </button>
            </div>
        </div>
    )
}
