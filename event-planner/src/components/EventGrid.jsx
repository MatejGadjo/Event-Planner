import React from 'react';
import EventCard from './EventCard';

const EventGrid = () => {
    const events = [
        { date: '9 Дек', name: 'Име на настан', location: 'Локација', time: '00:00 - 23:59' },
        { date: '9 Дек', name: 'Име на настан', location: 'Локација', time: '00:00 - 23:59' },
        { date: '9 Дек', name: 'Име на настан', location: 'Локација', time: '00:00 - 23:59' },
        { date: '9 Дек', name: 'Име на настан', location: 'Локација', time: '00:00 - 23:59' },
        { date: '9 Дек', name: 'Име на настан', location: 'Локација', time: '00:00 - 23:59' },
        { date: '9 Дек', name: 'Име на настан', location: 'Локација', time: '00:00 - 23:59' },
        // Add more events here
    ];

    return (
        <div className="event-grid">
            {events.map((event, index) => (
                <EventCard key={index} {...event} />
            ))}
        </div>
    );
};

export default EventGrid;
