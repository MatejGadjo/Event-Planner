import React from 'react';

const EventTicket = ({index}) => {
    return (
        <div key={index} className="ticket-placeholder">
            <div className="ticket-title-placeholder">
                <h2 className="card-title-title">Име на настан</h2>
                <p className="card-date-time">Пон, {index+1} Јан, 00:00 - 23:59</p>
            </div>
        </div>
    );
};

export default EventTicket;
