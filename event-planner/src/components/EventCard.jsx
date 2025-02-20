import React from 'react';

const EventCard = ({ date, name, location, time }) => {
    return (
        <div className="event-card">
            <div className="date">{date}</div>
            <div className="details">
                <h4>{name}</h4>
                <p>{location}</p>
                <p>{time}</p>
                <button>Понуди ресурси</button>
            </div>
        </div>
    );
};

export default EventCard;
