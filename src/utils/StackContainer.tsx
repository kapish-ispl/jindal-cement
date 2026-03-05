'use client'
import React from 'react'
import ScrollStack, { ScrollStackItem } from './ScrollStack'

const stackItems = [
    {
        id: 1,
        category: 'Infrastructure Projects',
        title: 'Phulwari Bridge',
        description: 'Bridge infrastructure supporting reinforced foundations and long-term structural performance.',
        image: '/images/bridge.png'
    },
    {
        id: 2,
        category: 'Renewable Energy',
        title: 'Modern Dam Project',
        description: 'Sustainable water management and hydroelectric power generation for the future.',
        image: '/images/dam.png'
    },
    {
        id: 3,
        category: 'Transport & Logistics',
        title: 'High-speed Railway',
        description: 'Connecting cities with high-speed rail networks, reducing travel time and carbon footprint.',
        image: '/images/railway.png'
    }
];

const StackContainer = () => {
    return (
        <section className="edge-to-edge-stack-section">
            <ScrollStack
                useWindowScroll={true}
                itemStackDistance={0}
                itemDistance={0}
                baseScale={0.9}
                itemScale={0.05}
                stackPosition="0%"
                scaleEndPosition="0%"
            >
                {stackItems.map((item) => (
                    <ScrollStackItem key={item.id} itemClassName="edge-to-edge">
                        <div className="card-tag">{item.category}</div>
                        <div className="card-image">
                            <img src={item.image} alt={item.title} />
                        </div>
                        <div className="card-content">
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                        </div>
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </section>
    )
}

export default StackContainer
