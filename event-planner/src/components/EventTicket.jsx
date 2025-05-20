import React from 'react';
import './css/EventTicket.css';

const EventTicket = ({ event, onRemove }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const days = ['Нед', 'Пон', 'Вто', 'Сре', 'Чет', 'Пет', 'Саб'];
        const months = ['Јан', 'Феб', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'];
        
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    };

    const handleRemove = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (window.confirm('Дали сте сигурни дека сакате да го избришете овој настан?')) {
            onRemove(event.id);
        }
    };

    return (
        <div className="event-ticket">
            <div className="event-ticket-content">
                <div className="event-ticket-header">
                    <h2 className="event-ticket-title">{event.title}</h2>
                    <div className="event-ticket-actions">
                        {event.isPrivate && (
                            <span className="event-ticket-private">Приватен</span>
                        )}
                        <button 
                            className="event-ticket-remove"
                            onClick={handleRemove}
                            aria-label="Remove event"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="event-ticket-details">
                    <div className="event-ticket-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                        </svg>
                        <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="event-ticket-time">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                        </svg>
                        <span>{event.startTime} - {event.endTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventTicket;
