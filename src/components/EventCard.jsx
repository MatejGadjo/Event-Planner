import React, { useState } from 'react';
import ContactPopup from './ContactPopup';
import './css/EventCard.css';

const EventCard = ({index}) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="event-card">
            <div className="event-card-header">
                <div className="event-date">
                    <span className="event-day">Пон</span>
                    <span className="event-date-number">{index+1}</span>
                    <span className="event-month">Јан</span>
                </div>
                <div className="event-info">
                    <div className="event-creator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                        </svg>
                        <span>Креатор</span>
                    </div>
                    <h2 className="event-title">Име на настан</h2>
                    <div className="event-details">
                        <div className="event-location">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                            <span>Локација</span>
                        </div>
                        <div className="event-time">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                            </svg>
                            <span>00:00 - 23:59</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="event-card-footer">
                <div className="event-tags">
                    {Array.from({ length: Math.floor(Math.random()*(5-1)+1) }).map((_, index) => (
                        <span key={index} className="event-tag">
                            <span className="tag-name">Ресурс {index+1}</span>
                            <span className="tag-count">{Math.floor(Math.random()*(1000-1)+1)}</span>
                        </span>
                    ))}
                </div>
                <div className="event-actions">
                    <span className="offers-count">0 понуди</span>
                    <button 
                        className="offer-button" 
                        onClick={() => setShowPopup(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                        понуди ресурси
                    </button>
                </div>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-button" onClick={() => setShowPopup(false)}>×</button>
                        <h2>Контактирај го креаторот</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setShowPopup(false);
                        }}>
                            <div className="form-group">
                                <label htmlFor="message">Вашата порака:</label>
                                <textarea
                                    id="message"
                                    placeholder="Напишете ја вашата порака тука..."
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                Испрати
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCard; 