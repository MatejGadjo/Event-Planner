import React from 'react';
import EventCard from './EventCard';

const EventGrid = () => {
    return (
        <div className="cards-grid">
            {Array.from({ length: 12 }).map((_, index) => (
                <EventCard index={index}></EventCard>
            ))}
        </div>
    );
};

export default EventGrid;
