import React, { useState, useEffect } from 'react';
import './css/ContactPopup.css';

const ContactPopup = ({ isOpen, onClose, eventCreator }) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log('ContactPopup mounted/updated, isOpen:', isOpen);
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted with message:', message);
        // Here you would typically send the message to the backend
        onClose();
    };

    if (!isOpen) {
        console.log('ContactPopup not rendering because isOpen is false');
        return null;
    }

    return (
        <div className="popup-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }}>
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Контактирај го креаторот</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="message">Вашата порака:</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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
    );
};

export default ContactPopup; 