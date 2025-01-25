'use client'

import React, { useState, useEffect, useRef, FC, memo } from 'react';

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
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Only set the interval once when the component mounts
    useEffect(() => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setTime(new Date().toLocaleTimeString());
            }, 1000);
        }

        // Cleanup the interval when the component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <div>
            <TimeDisplay time={time} />
        </div>
    );
};

export default ParentComponent;
