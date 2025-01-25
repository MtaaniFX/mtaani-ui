'use client'

import React, { useState, useEffect, FC, memo } from 'react';

// Define the type for the TimeDisplay props
interface TimeDisplayProps {
    time: string;
}

// Memoized TimeDisplay component that receives time as a prop
const TimeDisplay: FC<TimeDisplayProps> = memo(({ time }) => {
    return <h1>Current Time: {time}</h1>;
});

const ParentComponent: FC = () => {
    const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    console.log("Parent re-rendered");

    return (
        <div>
            <TimeDisplay time={time} />
        </div>
    );
};

export default ParentComponent;
