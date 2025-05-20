import React from 'react';
import { Link } from 'react-router-dom';
import './css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>E·QUIP<sup> мк</sup></h3>
                    <p>Вашиот партнер за организација на настани</p>
                </div>
                <div className="footer-section">
                    <h4>Брзи линкови</h4>
                    <ul>
                        <li><Link to="/">Почетна</Link></li>
                        <li><Link to="/events/public">Настани</Link></li>
                        <li><Link to="/users">Корисници</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Контакт</h4>
                    <ul>
                        <li>Email: info@equip.mk</li>
                        <li>Телефон: +389 XX XXX XXX</li>
                        <li>Адреса: Скопје, Македонија</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} E·QUIP мк. Сите права се задржани.</p>
            </div>
        </footer>
    );
};

export default Footer; 