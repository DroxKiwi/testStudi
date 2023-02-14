import React from 'react'
import Count from './Count'
import Clockv2 from './Clockv2'
import Clockv3 from './Clockv3'

export default function Frame() {
    return (
        <div>
            <Count />
            <Clockv2 />
            <Clockv3 />
        </div>
    )
}
