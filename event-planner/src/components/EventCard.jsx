import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

const EventCard = ({ event }) => {
    const navigate = useNavigate();
    const [creatorName, setCreatorName] = useState('');

    useEffect(() => {
        const fetchCreatorName = async () => {
            try {
                const creatorDoc = await getDoc(doc(db, "users", event.userId));
                if (creatorDoc.exists()) {
                    const creatorData = creatorDoc.data();
                    setCreatorName(`${creatorData.firstName} ${creatorData.lastName}`);
                }
            } catch (error) {
                console.error("Error fetching creator name:", error);
            }
        };

        fetchCreatorName();
    }, [event.userId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const days = ['Нед', 'Пон', 'Вто', 'Сре', 'Чет', 'Пет', 'Саб'];
        const months = ['Јан', 'Феб', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Август', 'Сеп', 'Окт', 'Ное', 'Дек'];
        
        return {
            day: days[date.getDay()],
            date: date.getDate(),
            month: months[date.getMonth()]
        };
    };

    const dateInfo = formatDate(event.date);

    return (
        <div className="event-card" onClick={() => navigate(`/eventdetail/${event.id}`)}>
            <div className="event-card-header">
                <div className="event-date">
                    <span className="event-day">{dateInfo.day}</span>
                    <span className="event-date-number">{dateInfo.date}</span>
                    <span className="event-month">{dateInfo.month}</span>
                </div>
                <div className="event-info">
                    <div className="event-creator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                        </svg>
                        <span>{creatorName || 'Вчитување...'}</span>
                    </div>
                    <h2 className="event-title">{event.title}</h2>
                    <div className="event-details">
                        <div className="event-location">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                            <span>{event.location}</span>
                        </div>
                        <div className="event-time">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                            </svg>
                            <span>{event.startTime} - {event.endTime}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="event-card-footer">
                <div className="event-tags">
                    {event.resources.map((resource, index) => (
                        <span key={index} className="event-tag">
                            {resource.name}
                        </span>
                    ))}
                </div>
                {event.isPrivate && (
                    <span className="private-badge">Приватен</span>
                )}
            </div>
        </div>
    );
};

export default EventCard;
