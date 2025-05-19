import React from 'react';
import './css/Home.css';

const Home = () => {
    return (
        <div className="event-container">
            <div className="home-left-side">
                <div className="logo-home animate-fade-in">E·QUIP<sup> мк</sup></div>
                <div className="hero-content animate-slide-up">
                    <h1 className="home-header">
                        ОРГАНИЗИРАШ <span className="highlight">НАСТАН?</span> <br />
                        ИМАШ ПОТРЕБА ОД <span className="highlight">РЕСУРС?</span>
                    </h1>
                    <p className="home-description">
                        Огласете го вашиот настан и оставете вашите <br />
                        потреби да дојдат до вас.
                    </p>
                    <div className="cta-buttons">
                        <a href="/createevent" className="btn-primary">
                            ОГЛАСИ НАСТАН
                        </a>
                        <a href="/events/public" className="btn-secondary">
                            ПРЕБАРУВАЈ НАСТАНИ
                        </a>
                    </div>
                </div>
            </div>
            <div className="home-right-side">
                <div className="image-overlay"></div>
                <img
                    src="/hero-image.jpg"
                    alt="People celebrating at an event"
                    className="home-bg-image"
                />
            </div>
        </div>
    );
};

export default Home;
