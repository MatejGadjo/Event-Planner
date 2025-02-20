import React from 'react';
import './css/Home.css';

const Home = () => {
    return (
        <div className="event-container">
            <div className="home-left-side">
                <div className="logo-home">LOGO</div>
                <h1 className="home-header">
                    ОРГАНИЗИРАШ <span className="highlight">НАСТАН?</span> <br />
                    ИМАШ ПОТРЕБА ОД <span className="highlight">РЕСУРС?</span>
                </h1>
                <p className="home-description">
                    Огласете го вашиот настан и оставете вашите <br />
                    потреби да дојдат до вас.
                </p>
                <a href="/createevent"><button className="btn-primary">ОГЛАСИ НАСТАН</button></a>
                <a href="/eventlist" className="event-list-link">
                    ПРЕБАРУВАЈ НАСТАНИ
                </a>
            </div>
            <div className="home-right-side">
                <img
                    src="/"
                    alt="People dancing at an event"
                    className="home-bg-image"
                />
            </div>
        </div>
    );
};

export default Home;
