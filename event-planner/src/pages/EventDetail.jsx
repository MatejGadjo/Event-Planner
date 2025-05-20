import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./css/EventDetail.css";
import "../App.css";

const EventDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContact, setShowContact] = useState(false);
    const [showOfferPopup, setShowOfferPopup] = useState(false);
    const [eventCreator, setEventCreator] = useState(null);
    const [userResources, setUserResources] = useState([]);
    const [selectedResources, setSelectedResources] = useState([]);
    const [resourcePrices, setResourcePrices] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventDoc = await getDoc(doc(db, "events", id));
                if (eventDoc.exists()) {
                    const eventData = { id: eventDoc.id, ...eventDoc.data() };
                    setEvent(eventData);
                    
                    // Fetch creator's information
                    const creatorDoc = await getDoc(doc(db, "users", eventData.userId));
                    if (creatorDoc.exists()) {
                        setEventCreator(creatorDoc.data());
                    }
                } else {
                    setError("Настанот не е пронајден");
                }
            } catch (err) {
                console.error("Error fetching event:", err);
                setError("Грешка при вчитување на настанот");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!user) return;

        const resourcesQuery = query(
            collection(db, "resources"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
            const resourcesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserResources(resourcesList);
        }, (error) => {
            console.error("Error fetching resources:", error);
        });

        return () => unsubscribe();
    }, [user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const days = ['Недела', 'Понеделник', 'Вторник', 'Среда', 'Четврток', 'Петок', 'Сабота'];
        const months = ['Јануари', 'Фебруари', 'Март', 'Април', 'Мај', 'Јуни', 'Јули', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
        
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    };

    const handleResourceSelect = (resource) => {
        setSelectedResources(prev => {
            const isSelected = prev.some(r => r.id === resource.id);
            if (isSelected) {
                // Remove price when deselecting
                const newPrices = { ...resourcePrices };
                delete newPrices[resource.id];
                setResourcePrices(newPrices);
                return prev.filter(r => r.id !== resource.id);
            } else {
                return [...prev, resource];
            }
        });
    };

    const handlePriceChange = (resourceId, price) => {
        setResourcePrices(prev => ({
            ...prev,
            [resourceId]: price
        }));
    };

    const handleSubmitOffer = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            // Create the offer document
            const offerData = {
                eventId: event.id,
                eventTitle: event.title,
                eventCreatorId: event.userId,
                offererId: user.uid,
                offererName: `${user.firstName} ${user.lastName}`,
                resources: selectedResources.map(resource => ({
                    id: resource.id,
                    name: resource.name,
                    category: resource.category,
                    price: resourcePrices[resource.id]
                })),
                totalPrice: selectedResources.reduce((sum, resource) => sum + (resourcePrices[resource.id] || 0), 0),
                status: 'pending',
                createdAt: serverTimestamp()
            };

            // Add the offer to Firestore
            const offerRef = await addDoc(collection(db, "offers"), offerData);

            // Create a notification for the event creator
            const notificationData = {
                userId: event.userId,
                type: 'new_offer',
                title: 'Нова понуда за ресурси',
                message: `${user.firstName || ''} ${user.lastName || ''} понуди ${selectedResources.map(resource => 
                    `${resource.name} за ${resourcePrices[resource.id]} ден.`
                ).join(', ')} за вашиот настан "${event.title}"`,
                offerId: offerRef.id,
                eventId: event.id,
                read: false,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, "notifications"), notificationData);

            // Show success message
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);

            // Close the popup and reset state
            setShowOfferPopup(false);
            setSelectedResources([]);
            setResourcePrices({});
        } catch (error) {
            console.error("Error submitting offer:", error);
            // TODO: Show error message to user
        }
    };

    const isFormValid = () => {
        return selectedResources.length > 0 && 
               selectedResources.every(resource => resourcePrices[resource.id] && resourcePrices[resource.id] > 0);
    };

    if (loading) {
        return (
            <div className="app-container">
                <Navbar user={user} />
                <div className="main-container">
                    <Sidebar />
                    <div className="event-detail-container">
                        <div className="loading">Вчитување...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-container">
                <Navbar user={user} />
                <div className="main-container">
                    <Sidebar />
                    <div className="event-detail-container">
                        <div className="error-message">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <div className="app-container">
            <Navbar user={user} />
            <div className="main-container">
                <Sidebar />
                <div className="event-detail-container">
                    {showSuccessMessage && (
                        <div className="success-message">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                            Понудата е успешно испратена!
                        </div>
                    )}
                    <div className="event-detail-header">
                        <h1>{event.title}</h1>
                        <div className="header-actions">
                            {event.isPrivate && <span className="private-badge">Приватен</span>}
                            {user && user.uid !== event.userId && (
                                <button 
                                    className="offer-button"
                                    onClick={() => setShowOfferPopup(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-seam" viewBox="0 0 16 16">
                                        <path d="M8.186 1.113a1 1 0 0 0-1.372 0l-2 2A1 1 0 0 0 5 4.118v2.765L3.186 8.113a1 1 0 0 0 0 1.774l2 2A1 1 0 0 0 6 12.118v2.765l1.814 1.814a1 1 0 0 0 1.372 0l2-2A1 1 0 0 0 11 11.882V9.118l1.814-1.814a1 1 0 0 0 0-1.774l-2-2A1 1 0 0 0 10 4.118V1.353a1 1 0 0 0-1.814-.24zM6 4.118l2-2 2 2v2.765L8 7.236 6 6.883zm0 7.764v2.765l2 2 2-2v-2.765L8 8.764zm6-7.764L10 1.353v2.765l2 2V4.118z"/>
                                    </svg>
                                    Понуди ресурси
                                </button>
                            )}
                            {user && (
                                <button 
                                    className="contact-button"
                                    onClick={() => setShowContact(true)}
                                >
                                    Контактирај креатор
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="event-detail-info">
                        <div className="info-section">
                            <h3>Детали за настанот</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Датум:</span>
                                    <span className="info-value">{formatDate(event.date)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Време:</span>
                                    <span className="info-value">{event.startTime} - {event.endTime}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Локација:</span>
                                    <span className="info-value">{event.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="description-section">
                            <h3>Опис</h3>
                            <p>{event.description || "Нема опис за настанот"}</p>
                        </div>

                        <div className="resources-section">
                            <h3>Потребни ресурси</h3>
                            {event.resources && event.resources.length > 0 ? (
                                <div className="resources-list">
                                    {event.resources.map((resource, index) => (
                                        <div key={index} className="resource-item">
                                            <span className="resource-name">{resource.name}</span>
                                            <span className="resource-category">{resource.category}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Нема потребни ресурси</p>
                            )}
                        </div>
                    </div>

                    {showContact && eventCreator && (
                        <div className="contact-modal">
                            <div className="contact-modal-content">
                                <button 
                                    className="close-button"
                                    onClick={() => setShowContact(false)}
                                >
                                    ×
                                </button>
                                <h3>Контакт информации</h3>
                                <div className="contact-info">
                                    <div className="contact-item">
                                        <span className="contact-label">Име:</span>
                                        <span className="contact-value">{eventCreator.firstName}</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-label">Презиме:</span>
                                        <span className="contact-value">{eventCreator.lastName}</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-label">Телефон:</span>
                                        <span className="contact-value">{eventCreator.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showOfferPopup && (
                        <div className="popup-overlay" onClick={() => setShowOfferPopup(false)}>
                            <div className="popup-content" onClick={e => e.stopPropagation()}>
                                <button className="close-button" onClick={() => setShowOfferPopup(false)}>×</button>
                                <h2>Понуди ресурси</h2>
                                <form onSubmit={handleSubmitOffer}>
                                    <div className="form-group">
                                        <label>Избери ресурси:</label>
                                        <div className="resources-list">
                                            {userResources.map((resource) => (
                                                <div 
                                                    key={resource.id} 
                                                    className={`resource-item ${selectedResources.some(r => r.id === resource.id) ? 'selected' : ''}`}
                                                    onClick={() => handleResourceSelect(resource)}
                                                >
                                                    <div className="resource-info">
                                                        <span className="resource-name">{resource.name}</span>
                                                        <span className="resource-category">{resource.category}</span>
                                                    </div>
                                                    <div className="resource-stats">
                                                        <span className="resource-quantity">Достапни: {resource.available}</span>
                                                    </div>
                                                    {selectedResources.some(r => r.id === resource.id) && (
                                                        <div className="resource-price">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={resourcePrices[resource.id] || ''}
                                                                onChange={(e) => handlePriceChange(resource.id, parseFloat(e.target.value))}
                                                                onClick={(e) => e.stopPropagation()}
                                                                placeholder="Цена"
                                                                required
                                                            />
                                                            <span className="currency">ден.</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="submit-button"
                                        disabled={!isFormValid()}
                                    >
                                        Испрати
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetail;