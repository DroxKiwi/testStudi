import React from 'react'
import { useState } from 'react'
import './Tabs.css'

export default function Tabs() {
    const [tabs, setTabs] = useState([
        {
            id: Math.random(),
            label: 'page1',
            content: (
                <div>
                    <p>
                        page 1 !
                    </p>
                </div>
            )
        },
        {
            id: Math.random(),
            label: 'page2',
            content: (
                <div>
                    <p>
                        page 2 !
                    </p>
                </div>
            )
        },
        {
            id: Math.random(),
            label: 'page3',
            content: (
                <div>
                    <p>
                        page 3 !
                    </p>
                </div>
            )
        }
    ])

    const [activeTab, setActiveTab] = useState(tabs[0])

    const handleClick = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div className="Wrapper">
            <ul className="Tabs">
                {tabs.map((tab) => {
                    return (
                        <li
                        key={tab.id}
                        onClick={() => handleClick(tab)}
                        className={["Tab", tab.id === activeTab.id ? "TabActive" : null].join(' ')}
                        >
                            {tab.label}
                        </li>
                    )
                })}
            </ul>
            <div className="ActiveTabContent">
                {activeTab.content}
            </div>
        </div>
    )
}
