import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import './css/NotificationBell.css';

const NotificationBell = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [offerCreator, setOfferCreator] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showContactWindow, setShowContactWindow] = useState(false);
    const [contactUser, setContactUser] = useState(null);

    useEffect(() => {
        if (!user) {
            // Ако нема корисник, исчисти известувањата и бројачот за непрочитани
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        // Креирај query за известувања за тековниот корисник, по датум сортирано
        const notificationsQuery = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        // Слушај во реално време промени на известувањата
        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            const notificationsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            setNotifications(notificationsList);
            // Пресметај колку известувања се непрочитани
            setUnreadCount(notificationsList.filter(n => !n.read).length);
        });

        return () => unsubscribe();
    }, [user]);

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            // Ако известувањето е непрочитано, означи го како прочитано во базата
            try {
                await updateDoc(doc(db, "notifications", notification.id), {
                    read: true
                });

                // Ажурирај го локалниот state за да ја намалиш бројката на непрочитани
                const updatedNotifications = notifications.map(n =>
                    n.id === notification.id ? { ...n, read: true } : n
                );
                setNotifications(updatedNotifications);
                setUnreadCount(prev => prev - 1);
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }

        if (notification.type === 'new_offer') {
            // Ако известувањето е за нова понуда, превземи детали за понудата и понудителот
            try {
                const offerDoc = await getDoc(doc(db, "offers", notification.offerId));
                if (offerDoc.exists()) {
                    const offerData = offerDoc.data();
                    setSelectedOffer({ ...offerData, id: offerDoc.id });

                    const creatorDoc = await getDoc(doc(db, "users", offerData.offererId));
                    if (creatorDoc.exists()) {
                        setOfferCreator(creatorDoc.data());
                    }
                }
            } catch (error) {
                console.error("Error fetching offer details:", error);
            }
        } else if (notification.type === 'offer_response' && notification.title === 'Понудата е прифатена') {
            // Ако понудата е прифатена, превземи контакт информации од креаторот на настанот
            try {
                const eventDoc = await getDoc(doc(db, "events", notification.eventId));
                if (eventDoc.exists()) {
                    const eventData = eventDoc.data();
                    const creatorDoc = await getDoc(doc(db, "users", eventData.userId));
                    if (creatorDoc.exists()) {
                        setContactUser(creatorDoc.data());
                        setShowContactWindow(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching contact details:", error);
            }
        }
    };

    const handleOfferResponse = async (offerId, status) => {
        try {
            // Ажурира статусот на понудата (прифатена или одбиена)
            await updateDoc(doc(db, "offers", offerId), {
                status: status
            });

            const offer = await getDoc(doc(db, "offers", offerId));
            const offerData = offer.data();

            if (status === 'accepted') {
                // Ако понудата е прифатена, намали ги достапните количини од ресурсите и означи ги како резервирани
                for (const resource of offerData.resources) {
                    const resourceRef = doc(db, "resources", resource.id);
                    const resourceDoc = await getDoc(resourceRef);

                    if (resourceDoc.exists()) {
                        const resourceData = resourceDoc.data();
                        const currentAvailable = resourceData.available || 0;
                        const offeredQuantity = resource.quantity || 1;
                        const newAvailable = Math.max(0, currentAvailable - offeredQuantity);

                        await updateDoc(resourceRef, {
                            available: newAvailable,
                            status: 'reserved',
                            reservedBy: offerData.offererId,
                            reservedFor: offerData.eventId
                        });
                    }
                }

                // Креирај известување за прифатена понуда
                const notificationData = {
                    userId: offerData.offererId,
                    type: 'offer_response',
                    title: 'Понудата е прифатена',
                    message: `Вашата понуда за "${offerData.eventTitle}" е прифатена!`,
                    offerId: offerId,
                    eventId: offerData.eventId,
                    read: false,
                    createdAt: serverTimestamp()
                };

                await addDoc(collection(db, "notifications"), notificationData);

                // Покази порака за успешна акција
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            } else if (status === 'rejected') {
                // Ако понудата е одбиена, испрати известување за тоа
                const notificationData = {
                    userId: offerData.offererId,
                    type: 'offer_response',
                    title: 'Понудата е одбиена',
                    message: `Вашата понуда за "${offerData.eventTitle}" е одбиена.`,
                    offerId: offerId,
                    eventId: offerData.eventId,
                    read: false,
                    createdAt: serverTimestamp()
                };

                await addDoc(collection(db, "notifications"), notificationData);
            }

            // Затвори го прозорецот со детали од понудата
            setSelectedOffer(null);
            setOfferCreator(null);
        } catch (error) {
            console.error("Error handling offer response:", error);
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';

        const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'сега';
        if (diffInSeconds < 3600) return `пред ${Math.floor(diffInSeconds / 60)} мин`;
        if (diffInSeconds < 86400) return `пред ${Math.floor(diffInSeconds / 3600)} ч`;
        return `пред ${Math.floor(diffInSeconds / 86400)} ден`;
    };

    return (
        <div className="notification-bell">
            <button
                className="bell-button"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {/* Икона за ѕвонче */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                </svg>
                {unreadCount > 0 && (
                    // Прикажи бројка на непрочитани известувања
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                        <div className="notifications-list">
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <h4>{notification.title}</h4>
                                            <span className="notification-time">
                                                {formatTimestamp(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p>{notification.message}</p>
                                        {notification.type === 'new_offer' && !notification.read && (
                                            <div className="notification-actions">
                                                {/* Копчиња за прифаќање или одбивање на понудата */}
                                                <button
                                                    className="accept-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Прекини ја propagation за да не се отвори целиот notification
                                                        handleOfferResponse(notification.offerId, 'accepted');
                                                    }}
                                                >
                                                    Прифати
                                                </button>
                                                <button
                                                    className="decline-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOfferResponse(notification.offerId, 'declined');
                                                    }}
                                                >
                                                    Одбиј
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-notifications">
                            Нема нови известувања
                        </div>
                    )}
                </div>
            )}

            {showSuccessMessage && (
                <div className="success-message">
                    Понудата е успешно прифатена!
                </div>
            )}

            {showContactWindow && contactUser && (
                <div className="contact-window-overlay" onClick={() => setShowContactWindow(false)}>
                    <div className="contact-window" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setShowContactWindow(false)}>×</button>
                        <h2>Контакт информации</h2>

                        <div className="contact-details">
                            <div className="contact-info">
                                <p><strong>Име:</strong> {contactUser.firstName} {contactUser.lastName}</p>
                                <p><strong>Телефон:</strong> {contactUser.phone || 'Нема телефон'}</p>
                                <p><strong>Емаил:</strong> {contactUser.email || 'Нема емаил'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedOffer && offerCreator && (
                <div className="offer-popup-overlay" onClick={() => setSelectedOffer(null)}>
                    <div className="offer-popup" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setSelectedOffer(null)}>×</button>
                        <h2>Детали за понудата</h2>

                        <div className="offer-details">
                            <h3>Понудител</h3>
                            <div className="contact-info">
                                <p><strong>Име:</strong> {offerCreator?.firstName || ''} {offerCreator?.lastName || ''}</p>
                                <p><strong>Телефон:</strong> {offerCreator?.phone || 'Нема телефон'}</p>
                                <p><strong>Емаил:</strong> {offerCreator?.email || 'Нема емаил'}</p>
                            </div>

                            <h3>Понудени ресурси</h3>
                            <div className="resources-list">
                                {selectedOffer.resources.map((resource, index) => (
                                    <div key={index} className="resource-item">
                                        <span className="resource-name">{resource.name}</span>
                                        <span className="resource-price">{resource.price} ден.</span>
                                    </div>
                                ))}
                            </div>

                            <div className="total-price">
                                <strong>Вкупна цена:</strong> {selectedOffer.totalPrice} ден.
                            </div>

                            <div className="offer-actions">
                                <button
                                    className="accept-button"
                                    onClick={() => {
                                        console.log('Accept clicked for offer:', selectedOffer.id);
                                        handleOfferResponse(selectedOffer.id, 'accepted');
                                    }}
                                >
                                    Прифати
                                </button>
                                <button
                                    className="decline-button"
                                    onClick={() => {
                                        console.log('Decline clicked for offer:', selectedOffer.id);
                                        handleOfferResponse(selectedOffer.id, 'declined');
                                    }}
                                >
                                    Одбиј
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
