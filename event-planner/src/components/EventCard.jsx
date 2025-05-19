import React from 'react';

const EventCard = ({index}) => {
    return (
        <div key={index} className="card-placeholder">
            <div className="card-top-section">
                <div className="card-date-placeholder">
                    <p className="card-date-day">Пон</p>
                    <h2 className="card-date-date">{index+1}</h2>
                    <p className="card-date-month">Јан</p>
                </div>
                <div className="card-title-placeholder">
                    <p className="card-title-creator">Креатор</p>
                    <h2 className="card-title-title">Име на настан</h2>
                    <div className="card-title-info">
                        <p className="card-title-location">Локација</p>
                        <p className="card-title-time">00:00 - 23:59</p>
                    </div>
                </div>
            </div>
            <div className="card-bottom-section">
                <div className="card-pills">
                    {Array.from({ length: Math.floor(Math.random()*(20-1)+1) }).map((_, index) => (
                        <span className="card-pill"> Ресурс {index}<span>{Math.floor(Math.random()*(1000-1)+1)}</span></span>
                    ))}
                </div>
                <div className="card-bottom-info">
                    <p className="card-budget">Буџет: $$$</p>
                    <p className="card-offer">понуди ресурси</p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
