import React from 'react';
import EventTicket from "./EventTicket";

const ItemCarousel = () => {
    return (
        <div className="event-cards-carousel">
            {Array.from({ length: 3 }).map((_, index) => (
                <EventTicket index={index}></EventTicket>
            ))}
        </div>
    );
};

export default ItemCarousel;
